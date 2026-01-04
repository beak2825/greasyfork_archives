// ==UserScript==
// @name         Cloudflare force create a non-glue record that is beneath a delegated child zone.
// @namespace    https://medium.com/chouhsiang
// @version      1.2
// @description  Plugin for Cloudflare. Fix error for: Cannot create a non-glue record that is beneath a delegated child zone. (Code: 89018).
// @author       Sean Chou
// @match        https://dash.cloudflare.com/*
// @icon        
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466545/Cloudflare%20force%20create%20a%20non-glue%20record%20that%20is%20beneath%20a%20delegated%20child%20zone.user.js
// @updateURL https://update.greasyfork.org/scripts/466545/Cloudflare%20force%20create%20a%20non-glue%20record%20that%20is%20beneath%20a%20delegated%20child%20zone.meta.js
// ==/UserScript==
async function submit(ele) {
  const u = new URL(window.location);
  const path = u.pathname.split("/");
  const account = path[1];
  const domain = path[2];

  // Check Insert or Update
  const form = ele.form;
  let record_id = form.parentElement.parentElement.id;
  record_id = record_id == "" ? null : record_id.split("-")[0];

  // Get zone id
  let url = `https://dash.cloudflare.com/api/v4/zones?name=${domain}&account.id=${account}`;
  let response = await fetch(url);
  let data = await response.json();
  const zone = data.result[0].id;

  // Get atok
  url = "https://dash.cloudflare.com/api/v4/system/bootstrap";
  response = await fetch(url);
  data = await response.json();
  const atok = data.result.data.atok;

  // Get form data
  const type = form.querySelector("[aria-labelledby=dns-label-type]").value;
  let name = form.querySelector("[aria-labelledby=dns-label-name]").value;
  if (!name.endsWith(domain)) {
    name += "." + domain;
  }
  let content;
  if (type == "A") {
    content = form.querySelector(
      "[aria-labelledby=dns-label-ipv4_address]"
    ).value;
  } else if (type == "AAAA") {
    content = form.querySelector(
      "[aria-labelledby=dns-label-ipv6_address]"
    ).value;
  } else if (type == "CNAME") {
    content = form.querySelector("[aria-labelledby=dns-label-target]").value;
  } else {
    alert("Only support A、AAAA、CNAME");
    return;
  }

  // Get ns record & delete
  const parent_domain = name.split(".").slice(1).join(".");
  url = `https://dash.cloudflare.com/api/v4/zones/${zone}/dns_records?type=NS&name=${parent_domain}`;
  response = await fetch(url);
  data = await response.json();
  const ns = data.result;
  for (const i of ns) {
    const dns_id = i.id;
    url = `https://dash.cloudflare.com/api/v4/zones/${zone}/dns_records/${dns_id}`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "X-Atok": atok,
        "X-Cross-Site-Security": "dash",
      },
    });
  }

  // Insert or update record
  let d = {
    content: content,
    name: name,
    type: type,
    zone_id: zone,
    zone_name: domain,
    proxied: true,
    ttl: 1,
    comment: "",
    data: {},
    proxiable: true,
    tags: [],
  };
  if (record_id) {
    url = `https://dash.cloudflare.com/api/v4/zones/${zone}/dns_records/${record_id}`;
    response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Atok": atok,
        "X-Cross-Site-Security": "dash",
      },
      body: JSON.stringify(d),
    });
    data = await response.json();
    if (data.success) {
      alert("Force update succeeded");
    } else {
      alert("Force update failed：" + JSON.stringify(data.errors));
    }
  } else {
    url = `https://dash.cloudflare.com/api/v4/zones/${zone}/dns_records`;
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Atok": atok,
        "X-Cross-Site-Security": "dash",
      },
      body: JSON.stringify(d),
    });
    data = await response.json();
    if (data.success) {
      alert("Force create succeeded");
    } else {
      alert("Force create succeeded：" + JSON.stringify(data.errors));
    }
  }

  // Add ns record
  for (const i of ns) {
    url = `https://dash.cloudflare.com/api/v4/zones/${zone}/dns_records`;
    d = {
      content: i.content,
      name: i.name,
      type: "NS",
      zone_id: zone,
      zone_name: domain,
    };
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Atok": atok,
        "X-Cross-Site-Security": "dash",
      },
      body: JSON.stringify(d),
    });
  }
  location.reload();
}

async function addBtn() {
  const u = new URL(window.location);
  if (u.host == "dash.cloudflare.com" && u.pathname.endsWith("/dns/records")) {
    const old_btns = document.querySelectorAll(
      "button[data-testid=dns-record-form-save-button]"
    );
    const new_btns = document.querySelectorAll(
      "button[data-testid=force-save-button]"
    );
    if (old_btns.length > new_btns.length) {
      const new_btn = document.createElement("button");
      new_btn.setAttribute("data-testid", "force-save-button");
      new_btn.setAttribute("type", "button");
      new_btn.setAttribute("class", old_btns[0].className);
      new_btn.setAttribute(
        "style",
        "margin-left: 8px; background-color: rgb(235, 20, 3)"
      );
      new_btn.innerText = "Force Save";
      new_btn.onclick = async function () {
        await submit(this);
      };
      old_btns.forEach(function (old_btn) {
        if (old_btn.nextSibling == null) {
          old_btn.parentNode.insertBefore(new_btn, old_btn.nextSibling);
        }
      });
    }
  }
}

setInterval(async () => await addBtn(), 1000);
