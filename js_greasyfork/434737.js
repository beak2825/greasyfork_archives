// ==UserScript==
// @name         wnacg jump
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  jump to indicate page
// @author       charles
// @match        http://www.wnacg.com/photos-slide-aid-*.html
// @icon         https://www.google.com/s2/favicons?domain=wnacg.com
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434737/wnacg%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/434737/wnacg%20jump.meta.js
// ==/UserScript==

const select = document.createElement("select");
select.style.position = "fixed";
select.style.top = "50%";
select.style.left = "10px";
select.style.height = "30px"

$("body").ready(() => {
        $("body").unbind("click");
    }
)
document.getElementsByTagName("body")[0].appendChild(select);

let count = 0;
let max = 0;
let index = 0;
let list = []
let optionList = []
window.onscroll = () => {
    let scrollTop = document.querySelector('html').scrollTop;
    if (optionList.length > index) {
        if (scrollTop <= optionList[index].offsetTop && index > 0) {
            index = index - 1;
            select.value = list[index];
            // document.querySelector("select").value = list[index]
        } else if (optionList.length > index + 1) {
            if (scrollTop >= optionList[index + 1].offsetTop) {
                index = index + 1;
                select.value = list[index];
                // document.querySelector("select").value = list[index]
            }
        }
    }
}
const observer = new MutationObserver(function (mutations_list) {
    mutations_list.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (added_node) {
            if (added_node.nodeName === "DIV") {
                if (count === 0) {
                    const span = document.querySelector("#img_list").querySelector("div").querySelector("span").innerText;
                    max = Number(span.split('/')[1]);
                }
                count = count + 1;
                const img = added_node.querySelector("img");
                const timer = setInterval(() => {
                    if (img.complete) {
                        clearInterval(timer)
                        let option = document.createElement("option");
                        option.innerText = count + "/" + max;
                        list.push(count + "/" + max);
                        select.appendChild(option);
                        optionList.push(added_node)
                        option.onclick = (e) => {
                            e.preventDefault();
                            document.querySelector("html").scrollTop = added_node.offsetTop;
                            $("body").focus()
                            // window.scrollTo(0, Number(rect.top))
                        }
                        option.onmousedown = (e) => {
                            e.preventDefault();
                        }
                    }
                }, 50)
                if (count === max) {
                    observer.disconnect();
                }
            }
        });
    });
});

observer.observe(document.querySelector("#img_list"), {subtree: false, childList: true});