// ==UserScript==
// @name         犇犇非对称加密插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  使用RSA算法对犇犇进行加密
// @license      GPL-3.0
// @author       LiuTianyou
// @match        https://www.luogu.com.cn/
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/jsencrypt@3.3.1/bin/jsencrypt.min.js
// @downloadURL https://update.greasyfork.org/scripts/459361/%E7%8A%87%E7%8A%87%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/459361/%E7%8A%87%E7%8A%87%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
window.jsEncrypt = new JSEncrypt();
window.encrypt = function(){
    var data = document.getElementById('feed-content').value;
    var publickey = document.getElementById('public-key').value;
    window.jsEncrypt.setPublicKey(publickey);
    document.getElementById('feed-content').value = window.jsEncrypt.encrypt(data);
};
window.decrypt = function(){
    var data = window.prompt("请输入数据", "");
    var privatekey = document.getElementById('private-key').value;
    if(privatekey == "" || privatekey == null) return;
    window.jsEncrypt.setPrivateKey(privatekey);
    alert(window.jsEncrypt.decrypt(data));
};
window.save = function(){
    window.localStorage.setItem("public_key", document.getElementById('public-key').value);
    window.localStorage.setItem("private_key", document.getElementById('private-key').value);
    alert("保存成功！");
}
setTimeout(function(){
    var benben = document.querySelector('.lg-index-benben');
    var public = document.createElement('div');
    public.className = "am-form-group am-form";
    var storaged_public, storaged_private;
    if(window.localStorage.getItem("public_key") == null) storaged_public = "";
    else storaged_public = window.localStorage.getItem("public_key");
    if(window.localStorage.getItem("private_key") == null) storaged_private = "";
    else storaged_private = window.localStorage.getItem("private_key");
    public.innerHTML = "<textarea rows='4' id='public-key' placeholder=\"公钥\">" + storaged_public + "</textarea>";
    benben.children[2].appendChild(public);
    var private = document.createElement('div');
    private.className = "am-form-group am-form";
    private.innerHTML = "<textarea rows='10' id='private-key' placeholder=\"私钥\">" + storaged_private + "</textarea>";
    benben.children[2].appendChild(private);
    var submit = document.createElement('button');
    submit.className = "am-btn am-btn-danger am-btn-sm";
    submit.innerText = "加密犇犇！";
    submit.addEventListener("click", window.encrypt);
    benben.children[2].appendChild(submit);
    var submit2 = document.createElement('button');
    submit2.className = "am-btn am-btn-danger am-btn-sm";
    submit2.innerText = "解密犇犇！";
    submit2.addEventListener("click", window.decrypt);
    benben.children[2].appendChild(submit2);
    var submit3 = document.createElement('button');
    submit3.className = "am-btn am-btn-danger am-btn-sm";
    submit3.innerText = "保存公私钥！";
    submit3.addEventListener("click", window.save);
    benben.children[2].appendChild(submit3);
}, 1000);