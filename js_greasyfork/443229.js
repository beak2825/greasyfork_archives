// ==UserScript==
// @name         StackEdit PicToUrl_modified
// @version      3.0.2
// @description  Convert pic to url when you paste a pic in clipboard to editor by Ctrl+V or drag some pics into editor
// @author       cool
// @match        https://stackedit.io
// @match        https://stackedit.io/app
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/30576
// @downloadURL https://update.greasyfork.org/scripts/443229/StackEdit%20PicToUrl_modified.user.js
// @updateURL https://update.greasyfork.org/scripts/443229/StackEdit%20PicToUrl_modified.meta.js
// ==/UserScript==
//
//
// this script is refactored from this script https://github.com/A-23187/StackEdit-PicToUrl and https://greasyfork.org/en/scripts/389667-stackedit-pictourl
// Thanks to author @A23187. However, it is not available due to sm.ms website changes its protocol.
// I refactored it and add one more option which benefits from the gitee's free unlimited space.
//

var account_info = GM_getValue("account_info", "none");
if (account_info == "none") {
  account_info = {
    //  please register a new account in the sm.ms, the token is attained under this link https://sm.ms/home/apitoken
    sm_API_token: "",

    //  please register a gitee account
    //   you can partially follow this tutorial https://zhuanlan.zhihu.com/p/102594554
    //   the gitee_user_repo is set to your_account_name/repository_name where uploaded images will be stored
    //   the uploaded images are automatically filed by dates/website_domain_random_name
    gitee_user_repo: "",
    gitee_personal_access_token: "",

    // GitLab
    jihuLab_user_repo: "",
    jihuLab_personal_access_token: "",
    jihuLab_email: "",
    jihuLab_username: "",
  };
  GM_setValue("account_info", JSON.stringify(account_info));
} else {
  account_info = JSON.parse(account_info);
}

// ======================================  sm.ms API class ==============================================================

class sm_API {
  constructor(token, api_url) {
    this.api_url = api_url;
    this.token = token;
  }

  async upload_pic(file_item) {
    var body = new FormData();
    body.append("smfile", file_item);
    let response_data = await upload_httpRequest(
      body,
      {
        Authorization: this.token,
      },
      this.api_url
    );
    let picRes = JSON.parse(response_data.response);

    if (picRes.code == "success") {
      return {
        code: "success",
        url: picRes.data.url,
      };
    } else {
      return {
        message: picRes.message,
        code: "failed",
      };
    }
  }
}

// ========================================= gitee API class ==========================================================

class gitee_API {
  constructor(token, commit_str, url_prefix) {
    this.token = token;
    this.commit_str = commit_str;
    this.url_prefix = url_prefix;
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  async upload_pic(file_item) {
    let pic_base64 = await this.readFile(file_item);
    let file_type = file_item.type.replace("image/", "");

    var body = new FormData();
    body.append("access_token", this.token);
    body.append(
      "content",
      pic_base64.replace(`data:image/${file_type};base64,`, "")
    );
    body.append("message", this.commit_str);

    let filename =
      document.domain +
      "_" +
      (Math.random().toString(36) + "000000").slice(2, 8 + 2); // random file name with 6 characters

    let response_data = await upload_httpRequest(
      body,
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      this.url_prefix + filename + "." + file_type
    );
    let picRes = JSON.parse(response_data.response);
    if (picRes.message == undefined) {
      return {
        code: "success",
        url: picRes.content.download_url,
      };
    } else {
      return {
        message: picRes.message,
        code: "failed",
      };
    }
  }
}

// ========================================= GitLab API class ==========================================================

class gitLab_API {
  constructor(token, username, user_email, repo_name, commit_str) {
    this.token = token;
    this.commit_str = commit_str;
    this.username = username;
    this.email = user_email;
    this.repo_name = repo_name;
    this.folder = `${new Date().toISOString().split("T")[0]}`;
    this.url_prefix = "";

    this.getRepositoryID(); // get the repository id
  }

  async getRepositoryID() {
    // the return inside a Promise is always wrapped as a Promise object.
    //1. https://jihulab.com/api/v4/projects?private_token=<token>&search=<repo>
    //2. return a list whose first element's id is the repo id
    //3. the upload post url is https://jihulab.com/api/v4/projects/<repo_id>/repository/files/<file_path_filename in URIencode format>
    let res = await makeGetRequest(
      `https://jihulab.com/api/v4/projects?private_token=${this.token}&search=${
        this.repo_name.split("/")[1]
      }`
    );
    res = JSON.parse(res);
    if (res.length > 0) {
      let repo_id = res[0].id;
      this.url_prefix = `https://jihulab.com/api/v4/projects/${repo_id}/repository/files/`;
    } else {
      throw `Can't abtain the repository ID from GitLab`;
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  async upload_pic(file_item) {
    let pic_base64 = await this.readFile(file_item);
    let file_type = file_item.type.replace("image/", "");

    var body = {
      branch: "master",
      author_email: this.email,
      author_name: this.username,
      encoding: "base64",
      content: pic_base64.replace(`data:image/${file_type};base64,`, ""),
      commit_message: this.commit_str,
    }; // GitLab only supports JSON post / CURL post

    let filename =
      this.folder +
      "/" +
      document.domain +
      "_" +
      (Math.random().toString(36) + "000000").slice(2, 8 + 2) + // random file name with 6 characters
      "." +
      file_type;

    filename = encodeURIComponent(filename);

    let response_data = await upload_httpRequest(
      JSON.stringify(body),
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": this.token,
      },
      this.url_prefix + filename
    );
    let picRes = JSON.parse(response_data.response);
    if (picRes.file_path != undefined) {
      return {
        code: "success",
        url: `https://jihulab.com/${this.repo_name}/-/raw/master/${picRes.file_path}`,
      };
    } else {
      return {
        message: picRes.message,
        code: "failed",
      };
    }
  }
}

// ===========================================  preset the variables ======================================================

// picUploadApp indicates which website we're using
// GM_registerMenuCommand("sm.ms", () => {
//   GM_setValue("picUploadApp", "sm.ms");
// });
// GM_registerMenuCommand("gitee", () => {
//   GM_setValue("picUploadApp", "gitee");
// });
// GM_registerMenuCommand("gitLab", () => {
//   GM_setValue("picUploadApp", "gitLab");
// });

GM_addStyle(`
			.tm-setting {display: flex;align-items: center;justify-content: space-between;padding-top: 20px;}

            
            .tabset {
                padding: 30px;
                max-width: 65em;
            }
            
            .tabset > input[type="radio"] {
                position: absolute;
                left: -200vw;
            }
            
            .tabset .tab-panel {
                display: none;
            }
            
            .tabset > input:first-child:checked ~ .tab-panels > .tab-panel:first-child,
            .tabset > input:nth-child(3):checked ~ .tab-panels > .tab-panel:nth-child(2),
            .tabset > input:nth-child(5):checked ~ .tab-panels > .tab-panel:nth-child(3),
            .tabset > input:nth-child(7):checked ~ .tab-panels > .tab-panel:nth-child(4),
            .tabset > input:nth-child(9):checked ~ .tab-panels > .tab-panel:nth-child(5),
            .tabset > input:nth-child(11):checked ~ .tab-panels > .tab-panel:nth-child(6) {
                display: block;
            }
            
            .tabset > label {
                position: relative;
                display: inline-block;
                padding: 15px 15px 25px;
                border: 1px solid transparent;
                border-bottom: 0;
                cursor: pointer;
                font-weight: 600;
            }
            
            .tabset > label::after {
                content: "";
                position: absolute;
                left: 15px;
                bottom: 10px;
                width: 22px;
                height: 4px;
                background: #8d8d8d;
            }
            
            .tabset > label:hover,
            .tabset > input:focus + label {
                color: #06c;
            }
            
            .tabset > label:hover::after,
            .tabset > input:focus + label::after,
            .tabset > input:checked + label::after {
                background: #06c;
            }
            
            .tabset > input:checked + label {
                border-color: #ccc;
                border-bottom: 1px solid #fff;
                margin-bottom: -1px;
            }
            
            .tab-panel {
                padding: 30px 0;
                border-top: 1px solid #ccc;
            }
		`);

GM_registerMenuCommand("setTokens", () => {
  let dom = `
  <div class="tabset">
    <!-- Tab 1 -->
    <input type="radio" name="tabset" id="tab1" aria-controls="sm_ms" checked>
    <label for="tab1">sm.ms</label>
    <!-- Tab 2 -->
    <input type="radio" name="tabset" id="tab2" aria-controls="gitee">
    <label for="tab2">Gitee</label>
    <!-- Tab 3 -->
    <input type="radio" name="tabset" id="tab3" aria-controls="gitlab">
    <label for="tab3">GitLab</label>
    
    <div class="tab-panels">
        <section id="sm_ms" class="tab-panel">
            <label class="tm-setting">sm.ms token<input type="text" id="sm_ms_token" value="${account_info.sm_API_token}"></label>
        </section>
        <section id="gitee" class="tab-panel">
            <label class="tm-setting">Gitee user/repo<input type="text" id="gitee_user_repo" value="${account_info.gitee_user_repo}"></label>
            <label class="tm-setting">Gitee token<input type="text" id="gitee_token" value="${account_info.gitee_personal_access_token}"></label>
        </section>
        <section id="gitlab" class="tab-panel">
            <label class="tm-setting">GitLab user/repo<input type="text" id="jihuLab_user_repo" value="${account_info.jihuLab_user_repo}"></label>
            <label class="tm-setting">GitLab token<input type="text" id="jihuLab_token" value="${account_info.jihuLab_personal_access_token}"></label>
            <label class="tm-setting">GitLab email<input type="text" id="jihuLab_email" value="${account_info.jihuLab_email}"></label>
            <label class="tm-setting">GitLab username<input type="text" id="jihuLab_username" value="${account_info.jihuLab_username}"></label>
        </section>
    </div>
  </div>`;
  Swal.fire({
    title: "Front Tab is the chosen service",
    html: dom,
    confirmButtonText: "Save",
    showCancelButton: true,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.value) {
      // save tokens
      account_info = {
        sm_API_token: document.querySelector("#sm_ms_token").value,
        gitee_user_repo: document.querySelector("#gitee_user_repo").value,
        gitee_personal_access_token:
          document.querySelector("#gitee_token").value,
        jihuLab_user_repo: document.querySelector("#jihuLab_user_repo").value,
        jihuLab_personal_access_token:
          document.querySelector("#jihuLab_token").value,
        jihuLab_email: document.querySelector("#jihuLab_email").value,
        jihuLab_username: document.querySelector("#jihuLab_username").value,
      };
      GM_setValue("account_info", JSON.stringify(account_info));

      // save chosen web service
      let checked_num = document
        .querySelector('input[type="radio"]:checked')
        .id.substring(3);
      let chosen_service = ["sm_ms", "gitee", "gitLab"][
        parseInt(checked_num) - 1
      ];
      GM_setValue("picUploadApp", chosen_service);
      picUploadApp = chosen_service;
      picUploadClass = initServiceClass(picUploadApp);

      history.go(0);
    }
  });
});

// set default value
var picUploadApp = GM_getValue("picUploadApp", "none");
if (picUploadApp == "none") {
  picUploadApp = "sm_ms";
  GM_setValue("picUploadApp", "sm_ms");
}

var picUploadClass = initServiceClass(picUploadApp);

// ==========================================================================================================

function initServiceClass(service) {
  if (service === "sm_ms") {
    return new sm_API(
      account_info.sm_API_token, // token
      "https://sm.ms/api/v2/upload"
    ); // API link, this is fixed.
  }
  if (service === "gitee") {
    return new gitee_API(
      account_info.gitee_personal_access_token, // personal access token
      "stackEdit image upload", // commit comments
      `https://gitee.com/api/v5/repos/${
        account_info.gitee_user_repo
      }/contents/${new Date().toISOString().split("T")[0]}/`
    ); //post url
  }
  if (service === "gitLab") {
    return new gitLab_API(
      account_info.jihuLab_personal_access_token, // personal access token
      account_info.jihuLab_username,
      account_info.jihuLab_email,
      account_info.jihuLab_user_repo,
      "stackEdit image upload" // commit comments
    ); //post url
  }
  throw "Undefined service website";
}

function makeGetRequest(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function (response) {
        resolve(response.responseText);
      },
      onerror: function (error) {
        reject(error);
      },
    });
  });
}

function upload_httpRequest(body, reqHeader, uploadURL) {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      url: uploadURL,
      method: "POST",
      headers: reqHeader,
      data: body,
      timeout: 30000,
      onload: (response) => {
        //console.log(url + " reqTime:" + (new Date() - time1));
        resolve(response);
      },
      onabort: (e) => {
        console.log(uploadURL + " abort");
        resolve("wrong");
      },
      onerror: (e) => {
        console.log(uploadURL + " error");
        console.log(e);
        resolve("wrong");
      },
      ontimeout: (e) => {
        console.log(uploadURL + " timeout");
        resolve("wrong");
      },
    });
  });
}

const notifier = {
  __notify: (type, msg) => {
    const d = [
      /* err  */
      "M 13 14 L 11 14 L 11 9.99998 L 13 9.99998 M 13 18 L 11 18 L 11 16 L 13 16 M 1 21 L 23 21 L 12 1.99998 L 1 21 Z",
      /* info */
      "M 12.9994 8.99805 L 10.9994 8.99805 L 10.9994 6.99805 L 12.9994 6.99805 M 12.9994 16.998 L 10.9994 16.998 L 10.9994 10.998 L 12.9994 10.998 M 11.9994 1.99805 C 6.47642 1.99805 1.99943 6.47504 1.99943 11.998 C 1.99943 17.5211 6.47642 21.998 11.9994 21.998 C 17.5224 21.998 21.9994 17.5211 21.9994 11.998 C 21.9994 6.47504 17.5224 1.99805 11.9994 1.99805 Z",
      /* ok   */
      "M 12,2C 17.5228,2 22,6.47716 22,12C 22,17.5228 17.5228,22 12,22C 6.47715,22 2,17.5228 2,12C 2,6.47716 6.47715,2 12,2 Z M 10.9999,16.5019L 17.9999,9.50193L 16.5859,8.08794L 10.9999,13.6739L 7.91391,10.5879L 6.49991,12.0019L 10.9999,16.5019 Z",
    ];

    var parent = document.getElementsByClassName("notification")[0];
    var element = document.createElement("div");
    const id = Date.now();

    parent.appendChild(element);
    element.outerHTML = `
        <div id="${id}" class="notification__item flex flex--row flex--align-center">
            <div class="notification__icon flex flex--column flex--center">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24"><path d="${d[type]}" /></svg>
            </div>
            <div class="notification__content">${msg}</div>
        </div>`;

    setTimeout(() => {
      parent.removeChild(document.getElementById(id));
    }, 2000);
  },
  err: (msg) => notifier.__notify(0, msg),
  info: (msg) => notifier.__notify(1, msg),
  ok: (msg) => notifier.__notify(2, msg),
};

async function uploadPic(pic) {
  notifier.info("Upload Pic ...");
  let resp = await picUploadClass.upload_pic(pic);
  if (resp.code == "success") {
    return resp.url;
  } else {
    notifier.err(resp.message);
    notifier.err("Fail to upload picture.");
  }
}

function insertUrlToEditor(url) {
  if (!url) return;
  var text = `![image](${url})`;
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // delete the original text chosen, if has.
  selection.deleteFromDocument();

  // create text node and insert it into current cursor position
  const node = document.createTextNode(text);
  selection.getRangeAt(0).insertNode(node);

  // select the sub text 'image', which will be modified
  const range = document.createRange();
  range.setStart(node, 2); // 2 - length of '!['
  range.setEnd(node, 7); // 7 - length of '![image'
  selection.removeAllRanges();
  selection.addRange(range);
}

function isPic(info) {
  return info.type && info.type.match(/^image\/.+$/i);
}

function onPaste(event) {
  const items = (event.clipboardData || event.originalEvent.clipboardData)
    .items;
  for (let i in items) {
    var item = items[i];
    if (isPic(item)) {
      uploadPic(item.getAsFile()).then((url) => insertUrlToEditor(url));
      break;
    }
  }
}

function onDrop() {
  // prevent the browser's default behavior and stop the propagation of all events
  ["dragenter", "dragover", "dragleave", "drop"].forEach((name) => {
    window.addEventListener(name, (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });

  return (event) => {
    var files = event.dataTransfer.files;
    [...files].forEach((file) => {
      if (isPic(file)) {
        uploadPic(file).then((url) => insertUrlToEditor(url));
      } else {
        // TODO if the file is a md or other plain text, to import it into editor
        notifier.err("Only pictures are allowed.");
      }
    });
  };
}

(function () {
  "use strict";
  if (document.location.pathname == "/") {
    document.location = document.location.origin + "/app";
    return;
  }

  window.addEventListener("paste", onPaste);
  window.addEventListener("drop", onDrop());
})();
