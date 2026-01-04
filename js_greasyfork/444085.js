// ==UserScript==
// @name         兰大自动评教(LZUAUTO)
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  兰州大学自动评教脚本
// @author       v2yield
// @match        http://qa.lzu.edu.cn:8081/new/student/lzdx_rank/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.10.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.1/js/jquery.dataTables.min.js
// @require      https://code.jquery.com/ui/1.10.1/jquery-ui.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444085/%E5%85%B0%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%28LZUAUTO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444085/%E5%85%B0%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%28LZUAUTO%29.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var pjlistT = new Object();//评价列表
    var skjslist = new Array(); //教师列表
    var needpk = new Array(); //需要评课的课程
    function entrance() {
        setTimeout(function () {
            $('#tipDlg .modal-footer button').click();
            console.log('进入')
        }, 7000)
    }
    function closecomment() {
        $('#finishDlg.modal.hide.fade.in button.btn.blue').click();//关闭评课结果
        console.log('关闭当前教师评课');
    }
    function comment() {
        /*comment for the teachers and lesson*/
        console.log('点击开始评课');
        var input_ls1 = $('#pjnr div.controls input');
        var text1 = $('#pjnr div.controls textarea');
        var input_ls2 = $('#pjnr1 div.controls input');
        var text2 = $('#pjnr1 div.controls textarea');
        var text = new Object()
        var input_ls = new Object()
        if(input_ls1.length != 0){
           text = text1
           input_ls = input_ls1
        }else{
           text = text2
           input_ls = input_ls2
        }
        var i = 0;
        for (i = 0; i < input_ls.length; i++) {
            input_ls[i].checked = false;
            input_ls[i].parentNode.setAttribute('class', '');
        }
        for (i = 0; i < input_ls.length; i += 5) {
            if (i == 0) {
                input_ls[i + 1].parentNode.setAttribute('class', 'checked');
                input_ls[i + 1].checked = true;
            } else {
                input_ls[i].parentNode.setAttribute('class', 'checked');
                input_ls[i].checked = true;
            }
        }
        for (i = 0; i < text.length; i++) {
            text[i].innerHTML = '无';
        }
        $('#pjsubmit').click();//提交
    }
    function closecommentlist() {
        $('#kfxpjDlg.modal.fade.hide.modal-overflow.in button.close').click();//关闭内部教师列表
        console.log('关闭教师列表')
    }
    function checkcomment() {//检测是否还有课未评
        var i = 0;
        var flag = true;
        for (i = 0; i < needpk.length; i++) {
            var str = needpk[i].getAttribute('onclick');//获取的onclick属性
            var n = str.match(/'ldztm':('\d{1,2}'|null)/g);//正则匹配ldztm
            var ldztm = n[0].split("'")[3];//获取ldztm,即判断课程是否评教
            var tmp = skjslist[i].getAttribute('onclick');
            var nz = tmp.match(/'ldztm':('\d{1,2}'|null)/g);
            var ldztmz = nz[0].split("'")[3];
            if (ldztm == undefined) {
                ldztm = null;
                ldztmz = null;
            } else {
                ldztm = parseInt(ldztm);
                ldztmz = parseInt(ldztmz);
            }
            console.log(ldztm);
            //先对大于3的课程评价
            if (str.indexOf("pjlist") != -1 && (ldztm == 0 || ldztm == null)) {
                console.log(str)
                needpk[i].click();
                console.log("1ldztm " + ldztm)
                console.log(needpk[i])
                comment();//评课
                closecomment();//关闭评课
            } else if (str.indexOf("tishi") != -1) { //对小于等于3的课程教师评价
                console.log(needpk[i])
                var str1 = skjslist[i].getAttribute('onclick');
                var n1 = str1.match(/'hkjssl':'(\d{1,2})'/g);
                var hkjssl = n1[0].split("'")[3];//获取hkjssl，即课程教师总数
                var n2 = str1.match(/'ldztm':('\d{1,2}'|null)/g);
                var ldztm1 = n2[0].split("'")[3];//获取ldztm，即已评教的教师总数
                if (ldztm1 == undefined) {
                    ldztm1 = null
                } else {
                    ldztm1 = parseInt(ldztm1)
                    hkjssl = parseInt(hkjssl)
                }
                console.log(skjslist[i])
                console.log("2ldztm: " + ldztm1 + " hkjssl: " + hkjssl)
                skjslist[i].click();
                if (ldztm1 < hkjssl) {
                    var j = 0
                    var tslist = $('#sample_2 tbody tr div.tdrepaire a');//内部教师列表
                    console.log(tslist)
                    for (j = 0; j < tslist.length; j++) {
                        var teacher = tslist[j].getAttribute('onclick');

                        var n3 = teacher.match(/'ldztm':('\d{1,2}'|null)/g);
                        var ldztm2 = n3[0].split("'")[3];//获取ldztm2，即判断教师是否被评教
                        if (ldztm2 == undefined) {
                            ldztm2 = null
                        } else {
                            ldztm2 = parseInt(ldztm2)
                        }
                        if (ldztm2 == null) {
                            tslist[j].click();
                            ldztm1++;
                            console.log(ldztm1 + "ldztm1\n" + hkjssl + " hkjssl")
                            console.log(teacher)
                            comment();//评教
                            closecomment();//关闭评教
                            if (ldztm1 == hkjssl) {
                                break;
                            }
                        }
                    }
                }
                closecommentlist()
            } else {
                console.log(needpk[i])
                if (str.indexOf("pjlist") != -1 && !(ldztm == 0 || ldztm == null)) {//对大于3的课程教师评价
                    var str2 = skjslist[i].getAttribute('onclick');

                    var n4 = str2.match(/'hkjssl':'(\d{1,2})'/g);
                    var hkjssl1 = n4[0].split("'")[3];//获取hkjssl1，即课程教师总数
                    var n5 = str2.match(/'ldztm':('\d{1,2}'|null)/g);
                    var ldztm3 = n5[0].split("'")[3];//获取ldztm3，即已评教的教师总数
                    if (ldztm3 == undefined) {
                        ldztm3 = null
                    } else {
                        ldztm3 = parseInt(ldztm3);
                        hkjssl1 = parseInt(hkjssl1)
                    }
                    console.log(skjslist[i])
                    console.log("3ldztm" + ldztm3)
                    console.log("3hkjssl" + hkjssl1)
                    skjslist[i].click();
                    if (ldztm3 < hkjssl1) {
                        var j = 0;
                        var tslist1 = $('#sample_2 tbody tr div.tdrepaire a');//内部教师列表
                        console.log(tslist1.length)
                        for (j = 0; j < tslist1.length; j++) {
                            var teacher1 = tslist1[j].getAttribute('onclick');
                            var n6 = teacher1.match(/'ldztm':('\d{1,2}'|null)/g);
                            var ldztm4 = n6[0].split("'")[3];//获取ldztm4，即判断教师是否被评教
                            if (ldztm4 == undefined) {
                                ldztm4 = null
                            } else {
                                ldztm4 = parseInt(ldztm4)
                            }
                            if (ldztm4 == 1) {
                                tslist1[j].click();
                                ldztm3++;
                                comment();//评教
                                closecomment();//关闭评教
                                if (ldztm3 == hkjssl1) {
                                    break;
                                }
                            }
                        }
                    }
                    closecommentlist()
                } else {
                    flag = false
                    if (!flag) {
                        break;
                    }
                }
            }
        }
        if (!flag) {
            clearInterval(timer);
            console.log('关闭时钟');
            alert('完成')
        }
    }
    function filterarry() {
        var length = skjslist.length;
        var i = 0;
        while (i < length) {
            var str1 = skjslist[i].getAttribute('onclick');
            var n1 = str1.match(/'hkjssl':'(\d{1,2})'/g);
            var hkjssl = n1[0].split("'")[3];//获取hkjssl，即课程教师总数
            var n2 = str1.match(/'ldztm':('\d{1,2}'|null)/g);
            var ldztm1 = n2[0].split("'")[3];//获取ldztm，即已评教的教师总数
            if (ldztm1 == undefined) {
                ldztm1 = null
            } else {
                ldztm1 = parseInt(ldztm1)
                hkjssl = parseInt(hkjssl)
            }
            if (ldztm1 == hkjssl) { //已评教教师数量等于课程教师总数
                skjslist.splice(i, 1);
                needpk.splice(i, 1);
                length--;
            } else {
                i++;
            }
            console.log("1ldztm: " + ldztm1 + " hkjssl: " + hkjssl)
            console.log('过滤')
            console.log(skjslist);
            console.log(needpk);
        }
    }
    // var finalbd = $("#hjjss").val(); //评课界限
    function update() {
        for (var i = 0; i < pjlistT.length; i++) {
            if (pjlistT[i].getAttribute('onclick') != null) {
                if (pjlistT[i].getAttribute('onclick').indexOf("skjsList") != -1) {
                    skjslist.push(pjlistT[i]);//
                }
                else if (pjlistT[i].getAttribute('onclick').indexOf("pjlist") != -1 || pjlistT[i].getAttribute('onclick').indexOf("tishi") != -1) {
                    needpk.push(pjlistT[i]);//课程列表
                }
            }
        }
        filterarry();
        console.log('更新评课状态');
        console.log(skjslist);
        console.log(needpk);
    }
    entrance();
    var timer = setInterval(function () {
        pjlistT = $('.btn.blue.mini');
        console.log(pjlistT)
        console.log(pjlistT.length)
        if(pjlistT.length > 1){
            //开始评教
            Action();
            console.log('结束')
            clearInterval(timer)
        }
    },2000);

    function Action() {
       var timer = setInterval(function () {
        pjlistT = $('.btn.blue.mini');
        console.log(pjlistT)
        skjslist.length = 0;
        needpk.length = 0;
        update();
        if (needpk.length == 0 && skjslist.length == 0) {
                clearInterval(timer);
                console.log('关闭时钟');
                alert('完成')
        } else {
                checkcomment();
       }

       }, 4000);
    };
})();