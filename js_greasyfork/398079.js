// ==UserScript==
// @name         主题过滤
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  过滤帖子,仅适用于部分网站
// @author       AM
// @match        https://*/thread.php*
// @match        https://*/search.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/398079/%E4%B8%BB%E9%A2%98%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/398079/%E4%B8%BB%E9%A2%98%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

function log(m){
    console.log(m);
}
function is_notundefined(obj){
    if(typeof obj != "undefined"){
        return true;
    }
    return false;
}
// read use data
function get_usedata(p){
    return GM_getValue(p,'null');
}
function get_xuse(){
    return get_usedata('xuse');
}
function get_xabc(){
    return get_usedata('xabc');
}
function get_dislike(){
    return get_usedata('dislikedir');
}

//
function adddivhtml(){
    let bodyhtml = document.getElementsByTagName("body")[0];
    let addhtml = '';
    //linkaddon
    addhtml += '<div id="linkaddon" ';
    addhtml += ' style="';
    addhtml += 'display: none;';
    addhtml += 'background: #ffffff;';
    addhtml += 'z-index:99999;';
    addhtml += 'position: fixed;';
    addhtml += 'margin:0 auto;';
    addhtml += 'max-width:80%;';
    addhtml += 'width:320px;';
    addhtml += 'height:auto;';
    addhtml += 'top:30%;';
    addhtml += 'left:10%;';
    addhtml += 'padding: 15px;';
    addhtml += 'box-shadow:rgb(77, 7, 177) 0 0 5px 5px;';
    addhtml += 'text-align: center;';
    addhtml += '">';
    addhtml += '<button id="closelinkdiv">关闭</button>';
    addhtml += '<br>';
    addhtml += '<div id="amlinkto"></div>';
    addhtml += '<br></div>';
    //xabcinput
    addhtml += '<div id="xabcdiv" ';
    addhtml += 'style="';
    addhtml += 'display: none;';
    addhtml += 'background: #ffffff;';
    addhtml += 'z-index:99999;';
    addhtml += 'position: fixed;';
    addhtml += 'margin:0 auto;';
    addhtml += 'width:80%;';
    addhtml += 'height:auto;';
    addhtml += 'top:30%;';
    addhtml += 'left:10%;';
    addhtml += 'border-radius: 15px;';
    addhtml += 'padding: 15px;';
    addhtml += 'box-shadow: 0 0 5px 5px #131313;';
    addhtml += 'text-align: center;';
    addhtml += '">';
    addhtml += '<div id="xabcclose">X点此关闭X</div>';
    addhtml += '<hr>';
    addhtml += '<textarea style="';
    addhtml += 'left:15px;right:15px;width:100%; height:162px;';
    addhtml += 'border: 1px solid #000;resize: none;padding: 0px;" ';
    addhtml += 'id="xabcinput"></textarea>';
    addhtml += '</div>';
    //xuseinput
    addhtml += '<div id="xusediv" ';
    addhtml += 'style="';
    addhtml += 'display: none;';
    addhtml += 'background: #ffffff;';
    addhtml += 'z-index:99999;';
    addhtml += 'position: fixed;';
    addhtml += 'margin:0 auto;';
    addhtml += 'width:80%;';
    addhtml += 'height:auto;';
    addhtml += 'top:30%;';
    addhtml += 'left:10%;';
    addhtml += 'border-radius: 15px;';
    addhtml += 'padding: 15px;';
    addhtml += 'box-shadow: 0 0 5px 5px #141414;';
    addhtml += 'text-align: center;';
    addhtml += '">';
    addhtml += '<div id="xuseclose">X点此关闭X</div>';
    addhtml += '<hr>';
    addhtml += '<textarea style="';
    addhtml += 'left:15px;right:15px;width:100%; height:162px;';
    addhtml += 'border: 1px solid #000;resize: none;padding: 0px;" ';
    addhtml += 'id="xuseinput"></textarea>';
    addhtml += '</div>';
    //
    addhtml += '<div id="xdisdiv" ';
    addhtml += 'style="';
    addhtml += 'display: none;';
    addhtml += 'background: #ffffff;';
    addhtml += 'z-index:99999;';
    addhtml += 'position: fixed;';
    addhtml += 'margin:0 auto;';
    addhtml += 'width:80%;';
    addhtml += 'height:auto;';
    addhtml += 'top:30%;';
    addhtml += 'left:10%;';
    addhtml += 'border-radius: 15px;';
    addhtml += 'padding: 15px;';
    addhtml += 'box-shadow: 0 0 5px 5px #141414;';
    addhtml += 'text-align: center;';
    addhtml += '">';
    addhtml += '<div id="xdisclose">X点此关闭X</div>';
    addhtml += '<hr>';
    addhtml += '<textarea style="';
    addhtml += 'left:15px;right:15px;width:100%; height:162px;';
    addhtml += 'border: 1px solid #000;resize: none;padding: 0px;" ';
    addhtml += 'id="xdisinput"></textarea>';
    addhtml += '</div>';
    bodyhtml.innerHTML = bodyhtml.innerHTML.concat(addhtml );
}
(function() {
    let showdislike = true;
    //置入div
    adddivhtml();
    //置入按钮
    showxabcbutton();
    //置入链接附加
    linksaddon();
    //绑定事件
    addeventx();
    //分析数据
    let tb = document.getElementById('ajaxtable');//取出对应列表
    let trtd,tbt,tbcon;
    if(tb == null || tb == ''){
        log('search');
        tb = document.getElementsByClassName('tr3 tac');
        //log(tb);
        for (var i = tb.length - 1; i >= 0; i--) {
            //log(i);
            tbcon = tb[i].getElementsByTagName("th")[0].getElementsByTagName("a")[0];
            //log(tbcon);
            if(is_xabc(tbcon.innerHTML)){
                tb[i].remove();
            }else{
                if(showdislike){
                    if(is_dislike(tbcon.innerHTML)){
                        tb[i].remove();
                    }else{
                        //log('u');
                        //log(tb[i])
                        tbcon = tb[i].children[3];
                        //log(tbcon);
                        if(xuser(tbcon)){tb[i].remove();}
                    }
                }else{
                    tbcon = tb[i].children[3];
                    if(xuser(tbcon)){tb[i].remove();}
                }
            }
        }
        return;
    }else{
        for (let i = tb.rows.length - 1; i >= 0; i--) {
            trtd = tb.rows[i].cells[1];//对应列
            if(is_notundefined(trtd)){
                tbt = trtd.getElementsByTagName("h3")[0];//取出h3标签数据
                if(is_notundefined(tbt)){
                    tbcon = tbt.children[0];
                    if(is_notundefined(tbcon)){
                        if(is_xabc(tbcon.innerHTML)){
                            tb.rows[i].innerHTML ='';
                        }else{
                            if(showdislike){
                                if(is_dislike(tbcon.innerHTML)){
                                    tb.rows[i].innerHTML ='';
                                }else{
                                    trtd = tb.rows[i].cells[2];
                                    if(xuser(trtd)){tb.rows[i].innerHTML ='';}
                                }
                            }else{
                                trtd = tb.rows[i].cells[2];
                                if(xuser(trtd)){tb.rows[i].innerHTML ='';}
                            }
                        }
                    }
                }
            }
        }
    }
}

)();

function xuser(uth){
    if(is_notundefined(uth)){
        if(is_xuse(uth.children[0].innerHTML)){
            return true;
        }else{
            //log(uid);
            return is_xuse(get_uid (uth.children[0].href));
        }
    }
}
function get_uid(con){
    if (con.indexOf('-uid-') != -1) {
        let uid = con.split('-');
        uid = uid[4];
        uid = uid.split('.')[0];
        return uid;
    }
    return '';
}
function is_xuse(con){
    //log(con);
    let xuse = get_xuse();
    let xuses = xuse.split("|");
    for (let i = xuses.length - 1; i >= 0; i--) {
        if (con.indexOf(xuses[i]) != -1) {
            return true;
        }
    }
    return false;
}
function is_xabc(con){
    let xabc = get_xabc();
    let xabcs = xabc.split("|");
    for (let i = xabcs.length - 1; i >= 0; i--) {
        if(xabcs[i] !=''){
            if (con.indexOf(xabcs[i]) != -1) {
                return true;
            }
        }
    }
    return false;
}

function is_dislike(con){
    let xabc = get_dislike();
    let xabcs = xabc.split("|");
    for (let i = xabcs.length - 1; i >= 0; i--) {
        if(xabcs[i] !=''){
            if (con.indexOf(xabcs[i]) != -1) {
                return true;
            }
        }
    }
    return false;
}



function xabcguid(){
    let obj = document.getElementById('guide');
    obj.innerHTML ='<li id="h_xabc"><a id="xabcdivshow">屏蔽词</a></li>' + obj.innerHTML;
    log(obj);
    document.getElementById('xabcdivshow').addEventListener('click',function(){
            document.getElementById("xabcdiv").style.display = "block";
            log('success');
    });
}





function linksaddon(){
    document.getElementById('closelinkdiv').addEventListener('click',function(){
        document.getElementById("linkaddon").style.display = "none";
    });
    let aarr = document.getElementsByTagName('a');
    document.oncontextmenu = function(e){
        e.preventDefault();
    };
    for (let ai = aarr.length - 1; ai >= 0; ai--){
        if(aarr[ai].innerHTML != ''){
            aarr[ai].oncontextmenu = function(e){
                if(e.button ==2){
                    let oEvent=e||event;
                    let ammsgdiv = document.getElementById("linkaddon");
                    ammsgdiv.style.left=oEvent.clientX+'px';
                    ammsgdiv.style.top=oEvent.clientY+'px';
                    ammsgdiv.style.display = "block";
                    let linkcon = get_uid(this.href);
                    let reg=/<\/?.+?\/?>/g;
                    let str = this.innerHTML;
                    str = str.replace(reg,' ');
                    reg = /&nbsp;/ig
                    str = str.replace(reg,' ');
                    //log(str);
                    let linkconsa = str.split(/[】\[\]【]/);
                    let linkconsb = str.split(/[【 & ` 】, _ | s* ： : \] \[ \+ ! ！\\ \/ ， ~ 、 \- — ー ～ \) \( ）（ ？ ? ·]/);
                    let linkcons = arrpush(linkconsa,linkconsb);
                    linkconsa = str.split(/[】\[\]【 v]/gi);
                    linkcons = arrpush(linkcons,linkconsa);
                    linkconsa = str.split(/[】\[\]【 汉]/gi);
                    linkcons = arrpush(linkcons,linkconsa);
                    linkconsa = str.split(/[】\[\]【 正]/gi);
                    linkcons = arrpush(linkcons,linkconsa);
                    linkconsa = str.split(/[】\[\]【 机]/gi);
                    linkcons = arrpush(linkcons,linkconsa);
                    let tempdivname;
                    if(linkcon != ''){
                        linkcon = '<button name="linkuseck">'+linkcon+'</button>';
                        tempdivname = "linkuseck";
                    }else{
                        linkcon = '';
                        tempdivname = "linkabcck";
                    }
                    for (let li =linkcons.length -1;li>=0; li--){
                        if(linkcons[li] != ''){
                            if(linkcons[li].match(/^\s*$/)){
                                //log('null');
                            }else{
                                linkcon += '<button name="'+tempdivname+'">'+linkcons[li]+'</button>';
                                if(tempdivname == 'linkabcck'){
                                    linkcon += '<button name="dislikeabc">'+linkcons[li]+'</button>'
                                }
                            }
                        }
                    }
                    document.getElementById("amlinkto").innerHTML = '<div id="amdivshowabc"  style="max-width:90%;"><a href="' + this.href+'"  target="_blank">在新标签页打开</a><br><br>'+linkcon +'</div><div id="addconjg"></div>';
                    let lca = document.getElementsByName('linkabcck')
                    for(let cai = lca.length -1; cai>=0;cai--){
                        lca[cai].addEventListener('click',function(){linkaddonfun(1,this.innerHTML)});
                    }
                    lca = document.getElementsByName('linkuseck')
                    for(let cai = lca.length -1; cai>=0;cai--){
                        lca[cai].addEventListener('click',function(){linkaddonfun(2,this.innerHTML)});
                    }
                    lca = document.getElementsByName('dislikeabc')
                    for(let cai = lca.length -1; cai>=0;cai--){
                        lca[cai].addEventListener('click',function(){linkaddonfun(3,this.innerHTML)});
                    }
                }
            };
        }
    }
}

function linkaddonfun(x,c){
    if(c == '' || is_notundefined(c)==false){
        log('null'+c);
    }else{
        log('add' + c);
        document.getElementById("addconjg").innerHTML = '';
        let xcon;
        if(x == 1){
            xcon = get_xabc();
        }
        if(x == 2){
            xcon = get_xuse();
        }
        if(x == 3){
            xcon = get_dislike();
        }
        let xcons = xcon.split("|");
        if(xcons.indexOf(c) != -1){
            document.getElementById("addconjg").innerHTML = '已存在';
            return;
        }
        xcon += '|' + c;
        //log(xcon);
        let outtxt = '';
        if(x == 1){
            GM_setValue('xabc',xcon);
            outtxt = '屏蔽词';
        }
        if(x == 2){
            GM_setValue('xuse',xcon);
            outtxt = '屏蔽用户';
        }
        if(x == 3){
            GM_setValue('dislikedir',xcon);
            outtxt = '不喜欢列表';
        }
        document.getElementById("addconjg").innerHTML = '已添加'+outtxt;
    }
}
function nolike(){
}
function arrpush(a,b){
    let ca = a.concat(b);
    return arrchs(ca);
}
function arrchs(ca){
    let map = new Map();
    let ra = new Array();
    for (let i = ca.length - 1; i >= 0; i--){
        if(map.has(ca[i])){
            map.set(ca[i],true);
        }else{
            map.set(ca[i],false);
            ra.push(ca[i]);
        }
    }
    return ra;
}

function showxabcbutton(){
    //xabcguid();
    let obj = document.getElementsByClassName('pagesone');
    for (let i = obj.length - 1; i >= 0; i--) {
        obj[i].innerHTML = obj[i].innerHTML.concat('<input type="button" name="sxabcinput" value="设置屏蔽词" style="height:auto;">');
        obj[i].innerHTML = obj[i].innerHTML.concat('<input type="button" name="sxuseinput" value="设置屏蔽用户" style="height:auto;">');
        obj[i].innerHTML = obj[i].innerHTML.concat('<input type="button" name="sxdisinput" value="设置不喜欢" style="height:auto;">');
    }
}
function addeventx(){
    document.getElementById('xabcinput').addEventListener('blur',function(){
        GM_setValue('xabc',this.value);
    });
    document.getElementById('xabcclose').addEventListener('click',function(){
        document.getElementById("xabcdiv").style.display = "none";
    });
    document.getElementById('xuseinput').addEventListener('blur',function(){
        GM_setValue('xuse',this.value);
    });
    document.getElementById('xuseclose').addEventListener('click',function(){
        document.getElementById("xusediv").style.display = "none";
    });
    //
    document.getElementById('xdisinput').addEventListener('blur',function(){
        GM_setValue('dislikedir',this.value);
    });
    document.getElementById('xdisclose').addEventListener('click',function(){
        document.getElementById("xdisdiv").style.display = "none";
    });
    let inpt = document.getElementsByName('sxabcinput');
    for(let i = inpt.length-1;i>=0;i--){
        inpt[i].addEventListener('click',function(){
            let xn = get_xabc();
            document.getElementById("xabcinput").value = xn;
            document.getElementById("xabcdiv").style.display = "block";
        });
    }
    inpt = document.getElementsByName('sxuseinput');
    for(let i = inpt.length-1;i>=0;i--){
        inpt[i].addEventListener('click',function(){
            let xn = get_xuse();
            document.getElementById("xuseinput").value = xn;
            document.getElementById("xusediv").style.display = "block";
        });
    }
    inpt = document.getElementsByName('sxdisinput');
    for(let i = inpt.length-1;i>=0;i--){
        inpt[i].addEventListener('click',function(){
            let xn = get_dislike();
            document.getElementById("xdisinput").value = xn;
            document.getElementById("xdisdiv").style.display = "block";
        });
    }
}