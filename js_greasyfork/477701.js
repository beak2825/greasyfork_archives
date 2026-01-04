// ==UserScript==
// @name         koyomate
// @namespace    gunjobiyori.com
// @version      0.1.0
// @description  したらば掲示板を実況向けにするスクリプト
// @author       euro_s
// @match        https://jbbs.shitaraba.net/bbs/read.cgi/internet/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477701/koyomate.user.js
// @updateURL https://update.greasyfork.org/scripts/477701/koyomate.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function add_replied_comment_loaded(replied_elem, has_anc_elem) {
        var dl = document.createElement("dl");
        var cp_replied_dt = replied_elem.cloneNode(true);
        dl.classList.add("rep-comment");
        dl.appendChild(cp_replied_dt);
        dl.style.display = "none";
        has_anc_elem.insertBefore(dl, has_anc_elem.firstElementChild);
    }

    function add_replied_comment_xhr(replied_elem, has_anc_elem) {
        var dl = document.createElement("dl");
        var cp_replied_dt = replied_elem.cloneNode(true);
        var cp_replied_dd = replied_elem.nextElementSibling.cloneNode(true);
        dl.classList.add("rep-comment");
        dl.appendChild(cp_replied_dt);
        dl.appendChild(cp_replied_dd);
        dl.style.display = "none";
        has_anc_elem.insertBefore(dl, has_anc_elem.firstElementChild);
    }

    function getBbsUrl() {
      const url = window.location.href;
      const splitted = url.split('/');
      // URL ex: https://jbbs.shitaraba.net/bbs/read.cgi/internet/25835/1688993025/
      // splitted: ["https:", "", "jbbs.shitaraba.net", "bbs", "read.cgi", "internet", "25835", "1688993025", ""]
      return `https://${splitted[2]}/${splitted[5]}/${splitted[6]}`;
    }

    // Function to update max-width of .img-popup
    function updateMaxWidth() {
        // Calculate max width as 80% of window's width
        let maxWidth = window.innerWidth * 0.8;

        // Get all .img-popup elements and update their max-width
        let popups = document.querySelectorAll('.img-popup');
        popups.forEach(popup => {
            popup.style.maxWidth = maxWidth + 'px';
        });
    }

    function reStyle() {
        const thread_body = document.getElementById("thread-body");
        var dts = Array.from(document.querySelectorAll("dl#thread-body > dt"));
        var dds = Array.from(document.querySelectorAll("dl#thread-body > dd"));
        var tables = Array.from(document.querySelectorAll("table"));

        // Clear the original elements
        dts.forEach((dt) => dt.remove());
        dds.forEach((dd) => dd.remove());
        tables.forEach((table) => table.remove());

        // Combine the dt and dd contents and append them to the parent
        dts.forEach((dt, index) => {
            let outerDiv = document.createElement("div");
            outerDiv.id = dt.id;
            outerDiv.classList.add("comment");
            let meta = document.createElement("span");
            meta.innerText = dt.querySelector("a").innerText + ": ";
            let comment = document.createElement("span");
            let aTags = dds[index].querySelectorAll("a");
            let imageLinks = Array.from(aTags).filter(a => a.innerText.match(/\.(jpeg|jpg|gif|png)$/i) !== null);
            imageLinks.forEach((link) => {
              let popup = document.createElement('img');
              popup.src = link.innerText;
              popup.className = 'img-popup';
              link.appendChild(popup);
            });
            // Update the max-width of all .img-popup elements
            updateMaxWidth();
            if (dt.querySelector("a").innerText == "1") {
                comment.innerHTML = dds[index].innerHTML;
            } else {
                comment.innerHTML = dds[index].innerHTML.replace(/<br>/g, " ").trim();
            }
            outerDiv.appendChild(meta);
            outerDiv.appendChild(comment);

            thread_body.appendChild(outerDiv);
        });

        const small = document.querySelector('body > small');
        if (small) {
          const aTags = small.querySelectorAll('a');
          aTags.forEach((a) => a.remove());
          const bbsUrl = getBbsUrl();
          const a = document.createElement('a');
          a.href = bbsUrl;
          a.innerText = '掲示板に戻る';
          small.appendChild(a);
        }
    }

    function add_replied_comment() {
        var has_anc = document.querySelectorAll("#thread-body > div > span > span.res");
        var reg = /\/(\d+)$/;
        for (var i = 0; i < has_anc.length; i++) {
            var replied_url = has_anc[i].querySelector('a').getAttribute('href');
            var reg_result = reg.exec(replied_url);
            var replied_id;
            if (reg_result) {
                replied_id = reg_result[1];
            } else {
                continue;
            }
            var replied_elem = document.getElementById("comment_" + replied_id);
            if (replied_elem) {
                add_replied_comment_loaded(replied_elem, has_anc[i]);
                has_anc[i].addEventListener("mouseenter", function () {
                    this.firstElementChild.style.display = "";
                });
            } else {
                has_anc[i].addEventListener("mouseenter", {
                    replied_id: replied_id,
                    replied_url: replied_url,
                    has_anc_elem: has_anc[i],
                    handleEvent: function () {
                        if (this.has_anc_elem.firstElementChild.tagName === "DL") {
                            this.has_anc_elem.firstElementChild.style.display = "";
                        } else {
                            const xhr = new XMLHttpRequest();
                            xhr.responseType = "document";
                            xhr.open("get", this.replied_url, true);
                            xhr.timeout = 5 * 1000;
                            xhr.addEventListener("load", {
                                replied_id: this.replied_id,
                                has_anc_elem: this.has_anc_elem,
                                handleEvent: function (res) {
                                    if (res.target.status !== 200) {
                                        return;
                                    }
                                    replied_elem = res.target.responseXML.getElementById("comment_" + this.replied_id);
                                    console.log(replied_elem);
                                    if (replied_elem) {
                                        add_replied_comment_xhr(replied_elem, this.has_anc_elem);
                                    }
                                    this.has_anc_elem.firstElementChild.style.display = "";
                                }
                            });
                            xhr.send();
                        }
                    }
                });

            }
            has_anc[i].addEventListener("mouseleave", function () {
                if (this.firstElementChild.tagName === "DL") {
                    this.firstElementChild.style.display = "none";
                }
            });
        }
    }

    function upDownButtons() {
        // Create a new button element for scrolling to bottom
        const buttonDown = document.createElement("button");
        buttonDown.id = "scrollToBottomButton";
        buttonDown.innerHTML = `
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj4KICAgIDxwYXRoIGQ9Ik0xNSAyMEw1IDEwaDIwbC0xMCAxMHoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo="/>
        `;

        // Create a new button element for scrolling to top
        const buttonUp = document.createElement("button");
        buttonUp.id = "scrollToTopButton";
        buttonUp.innerHTML = `
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj4KICAgIDxwYXRoIGQ9Ik0xNSAxMEw1IDIwaDIwbC0xMCAtMTB6IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K"/>
        `;

        // Add the buttons to the document body
        document.body.append(buttonDown, buttonUp);

        // Attach an event listener to the buttons to handle clicks
        buttonDown.addEventListener("click", function () {
          window.scrollTo({
            top: document.body.scrollHeight, // Scroll to the bottom of the page
            behavior: "smooth", // Animate the scroll
          });
        });

        buttonUp.addEventListener("click", function () {
          window.scrollTo({
            top: 0, // Scroll to the top of the page
            behavior: "smooth", // Animate the scroll
          });
        });
      }

      let isAutoReloading = true;
      function createProgressBar() {
        // Create the SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "40");
        svg.setAttribute("height", "40");
        svg.style.position = "fixed";
        svg.style.right = "20px";
        svg.style.top = "120px";
        svg.style.cursor = "pointer";

        // Create the background circle
        const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bgCircle.setAttribute("cx", "20");
        bgCircle.setAttribute("cy", "20");
        bgCircle.setAttribute("r", "16");
        bgCircle.setAttribute("stroke", "#ddd");
        bgCircle.setAttribute("stroke-width", "4");
        bgCircle.setAttribute("fill", "none");
        svg.appendChild(bgCircle);

        // Create the foreground circle (progress bar)
        const fgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        fgCircle.setAttribute("cx", "20");
        fgCircle.setAttribute("cy", "20");
        fgCircle.setAttribute("r", "16");
        fgCircle.setAttribute("stroke", "#3498db");
        fgCircle.setAttribute("stroke-width", "4");
        fgCircle.setAttribute("fill", "none");
        fgCircle.style.strokeDasharray = "113.04"; // 2 * PI * r (approx.)
        fgCircle.style.strokeDashoffset = "113.04";
        fgCircle.style.transform = "rotate(-90deg)";
        fgCircle.style.transformOrigin = "50% 50%";
        svg.addEventListener("click", function () {
          isAutoReloading = !isAutoReloading; // toggle auto reloading
          // Change the color of the progress bar based on the auto reloading status
          fgCircle.setAttribute("stroke", isAutoReloading ? "#3498db" : "#e74c3c");
        });
        svg.appendChild(fgCircle);

        document.body.appendChild(svg);
        return fgCircle;
      }

      let progressBar;
      function updateProgressBar(timeElapsed, totalTime) {
        const progress = timeElapsed / totalTime;
        const strokeLength = 113.04 * progress;
        progressBar.style.strokeDashoffset = 113.04 - strokeLength;
      }

      async function autoReload() {
        progressBar = createProgressBar();

        let elapsed = 0;

        async function run() {
          if (isAutoReloading) {
            elapsed += 50; // update every 50 msec
            updateProgressBar(elapsed, 5000);

            if (elapsed >= 5000) {
              await getMessage();
              elapsed = 0;
            }
            setTimeout(run, 50); // set the next run
          }
        }

        run(); // initial run
      }

      let toBottom = true;
      let lastScrollTop = 0;
      const FETCH_TIMEOUT = 1000;
      async function getMessage() {
        const lastMsg = document.querySelector("dl#thread-body > div.comment:last-child");
        const lastId = lastMsg.id.replace('comment_', '');
        const url = location.href + lastId + '-n';

        try {
          const response = await Promise.race([
            fetch(url),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), FETCH_TIMEOUT)
            )
          ]);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const arrayBuffer = await response.arrayBuffer();
            const html = new TextDecoder("euc-jp").decode(arrayBuffer);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            var dts = Array.from(doc.querySelectorAll("dl#thread-body > dt"));
            var dds = Array.from(doc.querySelectorAll("dl#thread-body > dd"));
            for (let i = 0; i < dts.length; i++) {
                if (dts[i].id == lastMsg.id) {
                    continue;
                }
                let outerDiv = document.createElement("div");
                outerDiv.id = dts[i].id;
                outerDiv.classList.add("comment");
                let meta = document.createElement("span");
                meta.innerText = dts[i].querySelector("a").innerText + ": ";
                let aTags = dds[i].querySelectorAll("a");
                let imageLinks = Array.from(aTags).filter(a => a.innerText.match(/\.(jpeg|jpg|gif|png)$/i) !== null);
                imageLinks.forEach((link) => {
                  let popup = document.createElement('img');
                  popup.src = link.innerText;
                  popup.className = 'img-popup';
                  link.appendChild(popup);
                });
                let comment = document.createElement("span");
                comment.innerHTML = dds[i].innerHTML.replace(/<br>/g, " ").trim();
                outerDiv.appendChild(meta);
                outerDiv.appendChild(comment);

                lastMsg.parentNode.appendChild(outerDiv);
            }

            if (toBottom) {
              window.scrollTo(0, document.body.scrollHeight);
            }
          }
        } catch (e) {
          console.error('Fetch failed!', e);
        }
      }

      function bottomEvent() {
        window.addEventListener("scroll", function () {
          const st = window.scrollY;
          // Check if we're at the bottom of the page
          if (st < lastScrollTop) {
            toBottom = false;
          } else if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight
          ) {
            toBottom = true;
          }
          lastScrollTop = st <= 0 ? 0 : st;
        });
      }

    // Ensure the operation is performed after the DOM is fully loaded
    window.addEventListener(
        "load",
        async function () {
            new MutationObserver(add_replied_comment).observe(
                document.querySelector('#thread-body'), { childList: true }
            );
            reStyle();
            add_replied_comment();
            upDownButtons();
            createProgressBar();
            bottomEvent();
            await autoReload();
            // Scroll to the bottom of the page
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
        },
        false
    );

    // Update the max-width of all .img-popup elements whenever the window is resized
    window.addEventListener('resize', updateMaxWidth, false);

    // ex. https://jbbs.shitaraba.net/bbs/read.cgi/internet/25835/1688993025/413-n
    const match = window.location.href.match(/(.+internet\/\d+\/\d+\/).+$/);
    if (match) {
        const url = match[1];
        window.location.href = url;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // CSS
    ////////////////////////////////////////////////////////////////////////////////
    GM_addStyle(`
  #thread-body {
    margin-left: 30px !important;
    margin-right: 30px !important;
    line-height: 2rem !important;
  }
  .site-header {
    display: none !important;
  }
  #new_response {
    display: none !important;
  }
  #g_floating_tag_zone {
    display: none !important;
  }
  #scrollToBottomButton, #scrollToTopButton {
    position: fixed;
    right: 20px;
    z-index: 10000;
    padding: 5px;
    cursor: pointer;
    background: #ddd;
    border: none;
    border-radius: 5px;
    transition: background 0.2s;
  }
  #scrollToBottomButton {
    top: 70px;
  }
  #scrollToTopButton {
    top: 20px;
  }
  #scrollToBottomButton:hover, #scrollToTopButton:hover {
    background: #bbb;
  }
  .img-popup {
      display: none;
      position: absolute;
      z-index: 1;
      border: 1px solid #ddd;
  }
  a:hover .img-popup {
      display: block;
  }
  `);
})();
