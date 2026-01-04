// ==UserScript==
// @name         认领页下载种子插件
// @namespace    http://tampermonkey.net/
// @version      2025-03-05
// @description  世界上没有时，就自己创造吧！
// @author       Marcello
// @match        https://ubits.club/claim.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528847/%E8%AE%A4%E9%A2%86%E9%A1%B5%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/528847/%E8%AE%A4%E9%A2%86%E9%A1%B5%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){

        function downloadFile(url, fileName) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            //a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        let trs = document.getElementById("claim-table").querySelectorAll("tr");
        for(let i=0; i<trs.length; i++){
            if (i == 0) {
                //<td class="colhead" align="center">操作</td>
                let newTD = document.createElement("td");
                newTD.setAttribute("class", "colhead")
                newTD.setAttribute("align", "center")
                newTD.innerText = "下载";
                trs[i].appendChild(newTD);
                continue
            }

            //console.log( trs[i].querySelectorAll("td")[0].innerText );
            // 创建按钮
            let button = document.createElement("button")
            {
                jQuery(button).data("details_href", trs[i].querySelectorAll("td")[2].querySelector("a").getAttribute("href"));

                button.setAttribute("style","width: max-content;display: flex;align-items: center")
                button.innerHTML = '<img style="margin-right: 4px;" class="staff_edit" src="pic/trans.gif">下载'
                button.addEventListener("click", function(){
                    // download.php?id=198301
                    let details = jQuery(this).data("details_href")
                    window.location.href = details.replaceAll("details.php","download.php")
                })
            }

            // 创建td
            let newTD = document.createElement("td");
            newTD.append(button);

            // 添加到tr
            trs[i].appendChild(newTD);
        }

        {
            let timer = new Array();
            let button = document.createElement("button")
            {
                button.setAttribute("style","width: max-content;display: flex;align-items: center")
                button.innerHTML = '<img style="margin-right: 4px;" class="staff_edit" src="pic/trans.gif">下载全部'
                button.addEventListener("click", function(){
                    let trs = document.getElementById("claim-table").querySelectorAll("tr");
                    for(let i=1; i<trs.length; i++) {
                        let details_href = trs[i].querySelectorAll("td")[2].querySelector("a").getAttribute("href")

                        let t = setTimeout(function (){
                            downloadFile(details_href.replaceAll("details.php","download.php"))
                        },1500*i)
                        //
                        timer.push(t);
                    }
                })
            }

            let stopButton = document.createElement("button")
            {
                stopButton.setAttribute("style","width: max-content;display: flex;align-items: center")
                stopButton.innerHTML = '<img style="margin-right: 4px;" class="staff_delete" src="pic/trans.gif">停止自动下载'
                stopButton.addEventListener("click", function(){
                    while (timer.length>0){
                        clearTimeout(timer.pop())
                    }
                })
            }

            let table = document.createElement("table")
            {
                table.setAttribute("style","border: 0; margin-bottom:10px")
            }
            let tr = document.createElement("tr");
            {
                let td0 = document.createElement("td");
                td0.setAttribute("style", "padding-right: 10px; border: none");
                td0.appendChild(button);
                tr.appendChild(td0)

                let td1 = document.createElement("td");
                td1.setAttribute("style", "padding-right: 10px; border: none");
                td1.appendChild(stopButton);
                tr.appendChild(td1)
            }
            table.appendChild(tr)


            jQuery("#claim-table").before(table)
        }
    }
})();