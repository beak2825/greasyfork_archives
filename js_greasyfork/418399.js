// ==UserScript==
// @name         电中在线学习辅助
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202012111000
// @description  中央广播电视中等专业学校线学习辅助
// @author       流浪的蛊惑
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @match        *://zzx.ouchn.edu.cn/edu/public/student/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418399/%E7%94%B5%E4%B8%AD%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/418399/%E7%94%B5%E4%B8%AD%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
/*MD5加密算法开始*/
var hexcase=0,chrsz=8;
function md5(s){return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function core_md5(x, len)
{
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;
    for(var i = 0; i < x.length; i += 16)
    {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}
function md5_cmn(q, a, b, x, s, t)
{
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
function core_hmac_md5(key, data)
{
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}
function safe_add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
function bit_rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}
function str2binl(str)
{
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(let i=0;i<str.length * chrsz;i+= chrsz)
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
}
function binl2hex(binarray)
{
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(let i = 0; i < binarray.length * 4; i++)
    {
        str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
}
/*MD5加密算法结束*/
var studata=null,spd=[],xxjl=0,xxrz={},scjz=true,xxtot=0,sysj=0,zsj=0;
function reTime(t){
    let d=parseInt(t/86400);
    let h=parseInt((t-d*86400)/3600);
    let m=parseInt((t-d*86400-h*3600)/60);
    let s=parseInt(t-d*86400-h*3600-m*60);
    let rs=d.toString()+"日"+h.toString()+"时"+m.toString()+"分"+s.toString()+"秒";
    return rs;
}
function login(un,up){//登陆平台
    let pd={};
    pd.username=un;
    pd.userpass=up;
    pd.isCheck=1;
    $.ajax({
        method:"POST",
        url:"/edu/api/student/login",
        dataType:"json",
        data:pd,
        success:function(e){
            document.getElementById("msg").innerText=e.error_message;
            if(e.error_code==2000){
                document.getElementById("ksxxbtn").outerHTML="";
                studata=e.data;
                getCourseList();
            }
        }
    });
}
function getCourseList(){//获取课程列表
    let pd={};
    pd.post_type="1";
    pd.username=studata.username;
    pd.usertype=studata.usertype;
    pd.token=studata.token;
    $.ajax({
        method:"POST",
        url:"/edu/api/student/getCourseList",
        dataType:"json",
        data:pd,
        success:function(e){
            if(e.error_code==2000){
                for(let i=0;i<e.data.result.length;i++){
                    getCourseDetal(e.data.result[i]);
                }
            }
        }
    });
}
function getCourseDetal(data){//获取课程详细列表
    let pd={};
    pd.plan_id=data.plan_id;
    pd.course_id=data.course_id;
    pd.zy_course_id=data.zy_course_id;
    pd.post_type="1";
    pd.username=studata.username;
    pd.usertype=studata.usertype;
    pd.token=studata.token;
    $.ajax({
        method:"POST",
        url:"/edu/api/student/getCourseDetal",
        dataType:"json",
        data:pd,
        success:function(e){
            if(e.error_code==2000){
                for(let i=0;i<e.data.chapterTree.children.length;i++){
                    for(let j=0;j<e.data.chapterTree.children[i].children.length;j++){
                        let vd={};//视频信息
                        vd.course_id=pd.zy_course_id;
                        vd.section_id=e.data.chapterTree.children[i].children[j].section_id;
                        vd.video_time=e.data.chapterTree.children[i].children[j].video.duration;
                        vd.video_id=e.data.chapterTree.children[i].children[j].video.video_id;
                        vd.study_rate=e.data.chapterTree.children[i].children[j].video.study_rate;
                        zsj+=parseInt(vd.video_time);
                        xxtot++;
                        if(e.data.chapterTree.children[i].children[j].video.study_rate<100){//跳过已学完视频
                            sysj+=parseInt(vd.video_time);
                            spd.push(vd);
                        }
                    }
                }
            }
        }
    });
}
function sign(videoId,userName,VideoTime){//提交签名信息
    userName="\""+userName+"\"";
    var i = parseInt(videoId) + parseInt(userName.substr(1, 3)),
        s = parseInt(VideoTime) + parseInt(userName.substr(4, 3)),
        n = i.toString() + s.toString() + "570b17d5e4163b99c430cd3c26497de5";
    return md5(n);
}
function videoEvents(data){//记录学习进度
    let pd={};
    pd.course_id=data.course_id;
    pd.section_id=data.section_id;
    pd.video_time=data.video_time;
    pd.video_id=data.video_id;
    pd.sign=sign(data.video_id,studata.username,data.video_time);
    pd.username=studata.username;
    pd.usertype=studata.usertype;
    pd.token=studata.token;
    $.ajax({
        method:"POST",
        url:"/edu/api/student/videoEvents",
        dataType:"json",
        data:pd,
        success:function(e){
            document.getElementById("msg").innerText=e.error_message;
            if(e.error_code==2000){
                xxjl++;
                localStorage.setItem("学习日志",JSON.stringify(xxrz));
            }else{
                location.reload();//错误后刷新页面
            }
        }
    });
}
(function() {
    'use strict';
    var info=document.getElementsByClassName("logo"),jgt=0,dl=document.getElementsByClassName("form-control"),dlbtn=document.getElementsByClassName("logC_btn");
    dlbtn[0].outerHTML="<button id=\"ksxxbtn\" onclick=\"document.getElementsByClassName('form-control')[2].value='开始学习'\">开始学习</button>";
    if(info.length>0){
        info[0].innerHTML="<div class=\"logC_other\"><div id=\"xxjd\"></div><div id=\"xxjs\"></div><div id=\"msg\"></div><div id=\"xxsj\"></div><div id=\"xxss\"></div></div>";
    }
    setInterval(function(){
        let xz=localStorage.getItem("学习日志");
        if(xz!=null && scjz){
            scjz=false;
            xxrz=JSON.parse(xz);
            dl[0].value=xxrz.username;
            dl[1].value=xxrz.userpass;
            dl[2].value="开始学习";
        }
        if(dl[2].value=="开始学习"){
            dl[2].value="";
            if(dl[0].value.length>1 && dl[1].value.length>1){
                login(dl[0].value,dl[1].value);
                if(scjz){
                    scjz=false;
                    xxrz.username=dl[0].value;
                    xxrz.userpass=dl[1].value;
                    localStorage.setItem("学习日志",JSON.stringify(xxrz));
                }
            }else{
                document.getElementById("msg").innerText="请输入用户名和密码！";
            }
        }
        if(xxjl<spd.length){
            if(jgt<=0){
                jgt=spd[xxjl].video_time;
            }else if(jgt==1){
                videoEvents(spd[xxjl]);
            }
            document.getElementById("xxjs").innerText="进度："+spd[xxjl].study_rate+"% 倒计时："+(jgt--);
            document.getElementById("xxjd").innerText="已学："+xxjl+" 应学："+spd.length+" 总数："+xxtot;
            document.getElementById("xxsj").innerText="总学时："+reTime(zsj);
            sysj--;
            document.getElementById("xxss").innerText="还要学："+reTime(sysj);
        }else{
            if(xz!=null && xxjl>0){
                localStorage.removeItem("学习日志");
            }
        }
    },1000);
})();