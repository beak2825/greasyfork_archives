// ==UserScript==
// @name         知网-文献-bibtex提取
// @namespace    https://www.tampermonkey.net/
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version      1.2.5
// @description  重庆邮电大学   从知网文献中直接复制bibtex
// @author       BN_Dou
// @license      AGPL License
// @match        https://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match        http://202.202.43.73:8000/rwt/CNKI*
// @match        http://202.202.43.73:8000/rwt/CNKI/https/NNYHGLUDN3WXTLUPMW4A/kcms/detail/detail.aspx?dbcode=*
// @match        202.202.43.73:8000/rwt/CNKI/https/NNYHGLUDN3WXTLUPMW4A/kcms/detail/detail.aspx?dbcode=*
// @match        202.202.43.73:8000/rwt/CNKI*
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @downloadURL https://update.greasyfork.org/scripts/445207/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/445207/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery(document).ready(function($) {

        window.onload = function(){

            var a = document.getElementById("paramdbname")
            var b = document.getElementById("paramfilename")
            var fileid = a.getAttribute("value") + '!' + b.getAttribute("value") +'!1!0'

            //添加按钮
            var x = document.getElementsByClassName("btn-tool")
            var input = document.createElement('li')
            input.setAttribute("id", "bibbtn")
            input.setAttribute("class", "btn-note")
            input.setAttribute("title", "Bibtex")
            input.innerHTML = ">>Bibtex<<"
            input.style = "width: 72px;height: 23px;cursor: pointer;color: #e8e6e3;"
            x[0].children[0].append(input)

            //按下按钮
            $("#bibbtn").click(function(){
                $.post("https://kns.cnki.net/kns8/manage/APIGetExport",
                {
                  filename:fileid,
                  displaymode:"NoteExpress"
                },

                function(data){
                    console.log(data);
                    var bibtext = ""
                    var ss = data.data[0].value[0]
                    var ssl = ss.split("<br>")
                    var label = ""
                    for (var j=0; j<ssl.length-1; j++){
                        var kk = ssl[j].toLocaleLowerCase().split(" ").join("").split("}:")
                        if(kk[0] == "{author"){
                            label = kk[1].split(";")[0]
                        }
                    }
                    for (var i=0; i<ssl.length-1; i++){
                        var k = ssl[i].toLocaleLowerCase().split(" ").join("").split("}:")
                        var item = k[0]
                        var detail = k[1]
                        if (item == "{referencetype"){
                            if (detail == "journalarticle"){
                                bibtext = "@article{" + label + ",\n"
                            }
                            else if(detail == "conferenceproceedings"){
                                bibtext = "@inproceedings{" + label + ",\n"
                            }
                            else if(detail == "patent"){
                                bibtext = "@patent{" + label + ",\n"
                            }
                            else if(detail == "thesis"){
                                bibtext = "@thesis{" + label + ",\n"
                            }
                        }
                        else if(item == "{issue"){
                            bibtext = bibtext + "  number={" + detail + "},\n"
                        }
                        else if(item == "{title"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if(item == "{author"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.split(";").join(" and ").substr(0, detail.split(";").join(" and ").length-5) + "},\n"
                        }
                        else if(item == "{authoraddress"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if(item == "{journal"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if(item == "{keywords"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if(item == "{abstract"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else{
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail + "},\n"
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