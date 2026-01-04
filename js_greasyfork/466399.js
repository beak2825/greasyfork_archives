
// @license MIT
// ==UserScript==
// @name         bibtex for ke
// @namespace    https://www.tampermonkey.net/
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version      1.4.0
// @description  最近在使用overleaf写论文，用到了BN_Dou同学的知网bibtex脚本，但是我不想要Abstract,Keywords,Notes,Database等信息，因此改了下BN_Dou同学的脚本
// @author       BN_Dou，Ke7
// @match        https://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match        http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match        https://kns.cnki.net/kns8/DefaultResult/Index?dbcode=*
// @match        https://kns.cnki.net/kcms2/article/abstract?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466399/bibtex%20for%20ke.user.js
// @updateURL https://update.greasyfork.org/scripts/466399/bibtex%20for%20ke.meta.js
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
                            //网站
                            else if(detail == "misc"){
                                bibtext = "@misc{" + label + ",\n"
                            }
                            else{
                                bibtext = "@unknown{" + label +",\n"
                            }
                        }
                        else if(item == "{issue"){
                            bibtext = bibtext + "   number={" + detail + "},\n"
                        }
                        else if(item == "{title"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if(item == "{author"){
                            var isChinese = /^[\u4e00-\u9fa5]+$/.test(detail.split(";").join(" {,} ").substr(-1));
                            if (isChinese) {
                               // 处理汉字情况
                               bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.split(";").join(" {,} ").substr(0, detail.split(";").join(" {,} ").length-5) + "},\n"
                            } else {
                               // 处理英文情况
                               bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.split(";").join(" and ").substr(0, detail.split(";").join(" and ").length-5) + "},\n"
                            }
                        }
                        else if(item == "{authoraddress"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if(item == "{journal"){
                            bibtext = bibtext + "   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if(item == "{keywords"){
                            bibtext=bibtext
                        }
                        else if(item == "{abstract"){
                            bibtext=bibtext
                        }
                        else if(item == "{notes"){
                            bibtext=bibtext
                        }
                        else if(item == "{databaseprovider"){
                            bibtext=bibtext
                        }
                        else{
                            bibtext=bibtext+"   " + item.substr(1, item.length-1) + "={" + detail.toLocaleUpperCase() + "},\n"
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