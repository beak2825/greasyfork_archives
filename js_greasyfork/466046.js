// ==UserScript==
// @name         知网 参考文献 bibtex 天津大学
// @namespace    https://uuanqin.top
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version      1.0.2
// @description  从知网文献中直接复制bibtex，适用于天津大学登录用户。可应用于天津大学论文写作模板中
// @author       uuanqin
// @match        https://*.eds.tju.edu.cn/kcms2/article/abstract*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466046/%E7%9F%A5%E7%BD%91%20%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%20bibtex%20%E5%A4%A9%E6%B4%A5%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/466046/%E7%9F%A5%E7%BD%91%20%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%20bibtex%20%E5%A4%A9%E6%B4%A5%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery(document).ready(function($) {

        window.onload = function(){

            var a = document.getElementById("paramdbname")
            var b = document.getElementById("paramfilename")
            var fileid = a.getAttribute("value") + '!' + b.getAttribute("value") +'!1!0'

            var x = document.getElementsByClassName("btn-tool")
            var input = document.createElement('li')
            input.setAttribute("id", "bibbtn")
            input.setAttribute("class", "btn-quote")
            //input.setAttribute("type", "button")
            input.setAttribute("title", "Bibtex")
            //input.setAttribute("onclick", "func(this)") href=\"javascript:void(0)\" onclick=\"getBib()\
            input.innerHTML = "<a><i></i>Bibtex</a>"
            x[0].children[0].append(input)

            $("#bibbtn").click(function(){
               var url = window.location.hostname; // Qin: get *.eds.tju.edu.cn
               $.post(`https://${url}/kns8/manage/ShowExport`,  // Qin: change API
                {
                  filename:fileid,
                  displaymode:"NoteExpress"
                },
                function(data){
                    console.log(data);
                    var bibtext = ""

                    // Qin: Parse content
                    var ss = data.match(/(?<=<li>).*(?=<\/li>)/g) // .data[0].value[0]
                    console.log(ss); // just for debugging
                    var ssl = ss[0].split("<br>")

                    var publisher = ""
                    for (var i=0; i<ssl.length-1; i++){
                        var k = ssl[i].toLocaleLowerCase().split(" ").join("").split(":")
                        var item = k[0]
                        var detail = k[1]
                        //console.log(item)
                        if (item == "{referencetype}"){
                            if (detail == "journalarticle"){
                                bibtext = "@article{cite_label,\n"
                            }
                            else if(detail == "conferenceproceedings"){
                                bibtext = "@inproceedings{cite_label,\n"
                            }
                            // Qin: Add your new pattern here
                            else if(detail == "thesis"){
                                // 什么都不需要做
                                // bibtext = "@mastersthesis{cite_label,\n"
                            }
                        }
                        else if(item == "{issue}"){
                            bibtext = bibtext + "   number={" + detail + "},\n" 
                        }
                        // Qin: 针对thesis进行优化

                        else if(item == "{typeofwork}"){

                            if(detail == "博士"){
                                bibtext = "@phdthesis{cite_label,\n" + bibtext
                            }
                            else if(detail == "硕士"){
                                bibtext = "@mastersthesis{cite_label,\n" + bibtext
                            }
                            bibtext = bibtext+ "   school={" + publisher + "},\n"
                            bibtext = bibtext+ "   address={请自行添加" + publisher + "的地址},\n"
                        }
                        else if(item == "{publisher}"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-2) + "={" + detail + "},\n"
                            publisher = detail
                        }

                        else {
                            bibtext = bibtext + "   " + item.substr(1, item.length-2) + "={" + detail + "},\n"
                        }
                    }
                    bibtext += "}"

                    //console.log(bibtext)
                    const copad = document.createElement('textarea')
                    copad.value = bibtext
                    document.body.appendChild(copad)
                    copad.select()
                    document.execCommand('Copy')
                    document.body.removeChild(copad)
                });
            })
        };
    })
})();