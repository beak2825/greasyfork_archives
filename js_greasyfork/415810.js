// ==UserScript==
// @name         腾讯视频（VIP，付费）电影下载
// @namespace    https://
// @version      0.2.1
// @description  搜索电影名，下载你想要的电影。一般付费电影可正常下载，有部分付费电影下载不了。
// @author       Ahua
// @match        https://v.qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415810/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%EF%BC%88VIP%EF%BC%8C%E4%BB%98%E8%B4%B9%EF%BC%89%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/415810/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%EF%BC%88VIP%EF%BC%8C%E4%BB%98%E8%B4%B9%EF%BC%89%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


//库存电影资源
var resources = [
    {
        name: '',
        url: "https://v.qq.com",
        type: '',
        max_qxd: "",
    },
    {
        name: '无问西东',
        max_qxd: ".321004.",
        type: '.ts',
        url: "https://apd-5be9048f395bccf320adad95de94def3.v.smtcdns.com/moviets.tc.qq.com/AibUWTpDW9NQz_5HR_q_TJzUu2Fi4j6ZnPPbTANUtDho/uwMROfz2r5xgoaQXGdGnC2df64gVTKzl5C_X6A3JOVT0QIb-/mTiGWcO3EjE32mtlMNYfhkMeZwEnBmKTGEXqePXsgli9vhBTwh92d0Ip3oCPS_y-8IftROodZ_atFCr4scfdhrp0ZCAkHtu6ivDgg5eFrHnefRn-apwjdBFmc_nFtBJsuk-29NtzrNrv0Wa1utfSE_CkYLMTuL181NkvRRA9_7c/043_g0027ko5qhe",
    },
    {
        name: '羞羞的铁拳',
        max_qxd: ".321004.",
        type: '.ts',
        url: "https://apd-8bd29bda9804dba154f332a3aba98138.v.smtcdns.com/moviets.tc.qq.com/AFtLcZHZaDC6B10ecSeOUzzt206Gq6dxchbtKbjZGtsE/uwMROfz2r5xgoaQXGdGnC2df64gVTKzl5C_X6A3JOVT0QIb-/bcqfnSQhXcEgm9eaJPTzR4sHXvYoB6_RpTmkc31E1APY_9SyfLilrhhsyRMW8r8KD3T7ZbtLRNOqUvXYF1V-NmqkNQqqHwIJbdAwxWyYIE1KMog5L-bqBUZCPzuPW6CJg6YiSwkkrkEN28PYC-a8ji5zlLxNEfmiL8-1sDeYFZ8/045_m0025mcvah8"
    },
    {
        name: '速度与激情8',
        max_qxd: ".321004.",
        type: '.ts',
        url: "https://apd-36957ad87a191adf5459e739d8611f87.v.smtcdns.com/vipts.tc.qq.com/Aq73SL6ShHsTza1eYZlk0rWfu1vfBg7QegzMiRwOpXJg/uwMROfz2r5xgoaQXGdGnC2df64gVTKzl5C_X6A3JOVT0QIb-/MWbYW-kDF3UGDV8XohuFggHABf51Xt5xzoe0W2xiAsU5UvgPDoVvhAAeSP3f5LlTonjwdKjvDN0OlYLDDD9A1QATIvPKEUGX1bEAUM2iFYm0K-2MZR350O66_hZTgEma9-8P9aCrtWw-7QtMgj0XPFUpB5Yu76N-UjVpZOQaYJM/06_h00248zwzvg"
    },
    {
        name: '西虹市首富',
        max_qxd: ".321004.",
        type: '.ts',
        url: "https://apd-37432e522c8f7943d815088d71798cbb.v.smtcdns.com/moviets.tc.qq.com/AGj6JETboC7_jysz2pDtanbOLKBIpyVxx5d8p3mgFTOg/uwMROfz2r5xgoaQXGdGnC2df64gVTKzl5C_X6A3JOVT0QIb-/bt1ZQmuXX7BxRZGFNw73H7m4UNx4TV8lGepFYnxX41Ar8IlaX3qclHq0w5Xd7_Ixq4a1PPdn1aIX2bBQregXcELQcI4C7ObWxwqfEjONhr3NrGnnhiZ7uSG0MXiIsmLQqV_3BZNuMRmSk3FHxnK0NLXc71iVjKiTMgrOn-px1IE/04_i0034jkpgel"
    },
];


//设置视频URL
var setting = {
    url: "",
    sum: 0,
    type: ".ts",
    qxd: ".321001."
};

//下载视频文件
function downloadMp4(num){
    if(resources[num].url!=null || resources[num].url!=""){
        setting.url = resources[num].url;
        setting.type = resources[num].type;
        setting.qxd = resources[num].max_qxd;
        for(var i=1;i<=32;i++){
            setting.sum = i;
            var url_video = setting.url + setting.qxd + setting.sum + setting.type;
            window.open(url_video);
        };
    }else{
        alert("对不起，您需要的电影链接出现问题，请重新输入电影名！！！");
    };
};

//主程序：搜索电影名下载电影
function main(){
    var temp = 0;
    var input = prompt("请输入你要下载的电影（请不要输入空格，字符）：");
    for(var i=0;i<resources.length;i++){
        if(resources[i].name==input){
            alert("现在开始下载："+input);
            downloadMp4(i);
            alert("已下载完："+input);
            temp = 1;
        };
    };
    if(temp!=1){
        alert("抱歉，未找到你要下载的资源！！！");
    };
};
main();