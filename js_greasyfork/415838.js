// ==UserScript==
// @name         V2EX-PGP-MSG
// @namespace    http://shendaowu.freevar.com/
// @version      0.2
// @description  通过 PGP 间接在 V2EX 上实现私信功能。
// @author       shendaowu
// @match        https://www.v2ex.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.10.7/openpgp.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415838/V2EX-PGP-MSG.user.js
// @updateURL https://update.greasyfork.org/scripts/415838/V2EX-PGP-MSG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $ = window.jQuery;
    let openpgp = window.openpgp;

    const markStr = "Greasy Fork 搜索 V2EX-PGP-MSG，让加密解密更方便。";

    let bodyText = $("body")[0].innerText;
    let re = new RegExp("-----BEGIN PGP MESSAGE-----.*?-----END PGP MESSAGE-----", "gms");
    let encryptedMessages = bodyText.match(re);
    if(encryptedMessages){
        let bodyHTML = $("body")[0].innerHTML;
        re = new RegExp("(-----BEGIN PGP MESSAGE-----)(.*?-----END PGP MESSAGE-----)");
        for(let i = 0; i < encryptedMessages.length; i++){
            bodyHTML = bodyHTML.replace(re, '-----TMP MARK-----$2<br><div style="border: 1px solid;white-space: pre-line" id="decrypted_messages_' + i + '"/>如果一直显示此消息表明很可能消息不是用你的公钥加密的。</div>');
        }
        re = new RegExp("-----TMP MARK-----", "gms");
        bodyHTML = bodyHTML.replace(re, "-----BEGIN PGP MESSAGE-----");
        $("body")[0].innerHTML = bodyHTML;
    }
    (async () => {
        if(!encryptedMessages) return;
        const privateKeyArmored = JSON.parse(localStorage.getItem("pri_key"));
        const passphrase = JSON.parse(localStorage.getItem("pgp_password"));
        const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
        await privateKey.decrypt(passphrase);
        for(let i = 0; i < encryptedMessages.length; i++){
            const { data: decrypted } = await openpgp.decrypt({
                message: await openpgp.message.readArmored(encryptedMessages[i]),
                privateKeys: [privateKey]
            });
            $("#decrypted_messages_" + i).text(decrypted);
        }
    })();

    bodyText = $("body")[0].innerText;
    re = new RegExp(markStr + ".*?-----BEGIN PGP PUBLIC KEY BLOCK-----.*?-----END PGP PUBLIC KEY BLOCK-----", "gms");
    let publicKeys = bodyText.match(re);
    if(publicKeys){
        re = new RegExp("(" + markStr + ".*?)(-----BEGIN PGP PUBLIC KEY BLOCK-----.*?-----END PGP PUBLIC KEY BLOCK-----)", "ms");
        for(let i = 0; i < publicKeys.length; i++){
            publicKeys[i] = publicKeys[i].replace(re, "$2");
        }
        let bodyHTML = $("body")[0].innerHTML;
        re = new RegExp("(" + markStr + "<br>)(-----BEGIN PGP PUBLIC KEY BLOCK-----.*?-----END PGP PUBLIC KEY BLOCK-----)");
        for(let i = 0; i < publicKeys.length; i++){
            bodyHTML = bodyHTML.replace(re, '$1<button id="use_pub_key_' + i + '" class="use_pub_key" type="button"/>使用以下公钥加密</button><br>$2');
        }
        $("body")[0].innerHTML = bodyHTML;
        $(".use_pub_key").click(function(){
            showEncryptMessageDialogAndFillPubKey(publicKeys[this.id.split("_")[3]]);
        });
    }
    $("body").append(
`<div id="encrypt_popup" style="width: 100vw;height: 100vh;background-color: rgba(0, 0, 0, .5);position: fixed;left: 0;top: 0;bottom: 0;right: 0;display: none;justify-content: center;align-items: center;">
    <div style="overflow: auto;width: 800px;height: 500px;background-color: #fff;box-sizing: border-box;padding: 10px 30px;color: black;">
            <button id="close_encrypt_popup" type="button">关闭</button>
            <button id="encrypt_message" type="button">加密</button>
            <button id="append_to_reply" type="button">密文附加到回复并关闭弹窗</button>
            <br>
            需要加密的消息：
            <textarea id="message_to_be_encrypt" style="width: 100%;height: 200px;"></textarea><br>
            密文：
            <textarea id="encrypted_message" style="width: 100%;height: 200px;"></textarea><br>
            公钥：
            <textarea id="selected_pub_key" style="width: 100%;height: 200px;"></textarea><br>
    </div>
</div>`);
    $("#close_encrypt_popup").click(function(){$("#encrypt_popup").css("display", "none");});
    $("#encrypt_message").click(function(){encryptMessage();});
    function showEncryptMessageDialogAndFillPubKey(pubKey){
        $("#encrypt_popup").css("display", "flex");
        $("#selected_pub_key").val(pubKey);
    }
    let encryptMessage = async () => {
        const publicKeyArmored = $("#selected_pub_key").val();
        const { data: encrypted } = await openpgp.encrypt({
            message: openpgp.message.fromText($("#message_to_be_encrypt").val()),
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
        });
        $("#encrypted_message").val(encrypted);
    };
    $("#append_to_reply").click(function(){
        $("#reply_content").val($("#reply_content").val() + $("#encrypted_message").val());
        $("#encrypt_popup").css("display", "none");
    });

    $('<button id="show_PGP_manager_popup" type="button"/>PGP</button>').insertBefore(".top[href='/']");
    $('<button id="show_encrypt_message_dialog" type="button"/>加密</button>').insertBefore(".top[href='/']");
    $("#show_encrypt_message_dialog").click(function(){
        $("#encrypt_popup").css("display", "flex");
    });
    $("body").append(
`<div id="PGP_manager_popup" style="width: 100vw;height: 100vh;background-color: rgba(0, 0, 0, .5);position: fixed;left: 0;top: 0;bottom: 0;right: 0;display: none;justify-content: center;align-items: center;">
    <div style="overflow: auto;width: 800px;height: 500px;background-color: #fff;box-sizing: border-box;padding: 10px 30px;color: black;">
            <button id="close_PGP_manager_popup" type="button">关闭</button>
            <button id="generate_key_pair" type="button">生成密钥</button>
            <button id="save_key_pair_and_pass" type="button">保存密钥和密码</button>
            <button id="load_key_pair_and_pass" type="button">加载密钥和密码</button>
            <button id="pgp_help" type="button">使用说明</button>
            <br>
            姓名：<input type="text" id="pgp_name" size="40" value="Jon Smith"><br>
            邮箱：<input type="text" id="pgp_email" size="40" value="jon@example.com"><br>
            密码：<input type="text" id="pgp_password" size="40" value="super long and hard to guess secret"><br>
            建议手动备份以下三个密钥。点击保存密钥按钮只会把密钥和密码存储在浏览器的 Local Storage 里。
            保存私钥是为了自动解密密文。Local Storage 里的东西重装浏览器或者清除浏览器历史记录可能会没。
            理论上其他软件生成的公钥和私钥粘贴到这里再保存应该也可以，不过我没试过。<br>
            公钥：
            <textarea id="pub_key" style="width: 100%;height: 200px;"></textarea><br>
            私钥：
            <textarea id="pri_key" style="width: 100%;height: 200px;"></textarea><br>
            撤销证书：
            <textarea id="rev_key" style="width: 100%;height: 200px;"></textarea>
    </div>
</div>`);
    $("#show_PGP_manager_popup").on('click', function(){$("#PGP_manager_popup").css("display", "flex");});
    $("#generate_key_pair").click(function(){genKeyPair();});
    $("#close_PGP_manager_popup").click(function(){$("#PGP_manager_popup").css("display", "none");});
    $("#save_key_pair_and_pass").click(function(){
        let isHasSavedKeyOrPassword = false;
        if( localStorage.getItem("pgp_password") != null ||
           localStorage.getItem("pub_key") != null ||
           localStorage.getItem("pri_key") != null ||
           localStorage.getItem("rev_key") != null ){
            isHasSavedKeyOrPassword = true;
        }
        let isClickConfirm = false;
        if(isHasSavedKeyOrPassword){
            isClickConfirm = confirm("存在已保存的密钥或密钥密码，确定覆盖？");
        }
        if(!isHasSavedKeyOrPassword || (isHasSavedKeyOrPassword && isClickConfirm)){
            localStorage.setItem("pgp_password", JSON.stringify($("#pgp_password").val()));
            localStorage.setItem("pub_key", JSON.stringify($("#pub_key").val()));
            localStorage.setItem("pri_key", JSON.stringify($("#pri_key").val()));
            localStorage.setItem("rev_key", JSON.stringify($("#rev_key").val()));
        }
    });
    $("#load_key_pair_and_pass").click(function(){
        $("#pgp_password").val(JSON.parse(localStorage.getItem("pgp_password")));
        $("#pub_key").val(JSON.parse(localStorage.getItem("pub_key")));
        $("#pri_key").val(JSON.parse(localStorage.getItem("pri_key")));
        $("#rev_key").val(JSON.parse(localStorage.getItem("rev_key")));
        $("#pgp_name").val("");
        $("#pgp_email").val("");
    });
    let genKeyPair = async () => {
        const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
            userIds: [{ name: $("#pgp_name").val(), email: $("#pgp_email").val() }],
            curve: 'ed25519',
            passphrase: $("#pgp_password").val()
        });
        $("#pri_key").val(privateKeyArmored);
        $("#pub_key").val(publicKeyArmored);
        $("#rev_key").val(revocationCertificate);
    };
    $("#pgp_help").click(function(){
        alert(
`第一步：点击右上角的“PGP”按钮。在弹出的窗口中填入姓名、邮箱和密码。然后点击“生成密钥”按钮。然后点击“保存密钥和密码”按钮。点击“关闭”按钮。
第二步：点击创建新主题的正文文本框或者回复文本框下面的“附加保存的公钥”按钮。
第三步：点击公钥上面的“使用以下公钥加密”按钮。在弹出的窗口中填入要加密的内容。点击“加密”按钮。点击“密文附加到回复并关闭弹窗”按钮。此步一般应该由他人完成。
第四步：刷新页面，使用自己发布的公钥加密的内容将自动解密。
注意1：多次回复带有同一链接会被 V2EX 判定为 spam。删除带链接的那行好像不影响加密解密。
注意2：公钥前面的那行不能删除。算是我的脚本的广告。
注意3：PGP 相关的文章好像不多，推荐搜“非对称加密”了解相关知识。`);
    });

    $('<button id="append_saved_pub_key" type="button"/>附加保存的公钥</button>').insertAfter("textarea#topic_content");
    $("#append_saved_pub_key").click(function(){
        $("textarea#topic_content").val($("textarea#topic_content").val() + markStr + "\r\n" + JSON.parse(localStorage.getItem("pub_key")));
    });
    //创建主题和创建回复的文本框好像不会同时出现。
    $('<button id="append_saved_pub_key" type="button"/>附加保存的公钥</button>').insertAfter("#reply_content");
    $("#append_saved_pub_key").click(function(){
        $("textarea#reply_content").val($("textarea#reply_content").val() + markStr + "\r\n" + JSON.parse(localStorage.getItem("pub_key")));
    });
})();