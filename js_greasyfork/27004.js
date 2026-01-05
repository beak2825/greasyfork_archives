// ==UserScript==
// @name         Allow leaching on BakaBT :/
// @namespace    https://greasyfork.org/en/scripts/27004-allow-leaching-on-bakabt
// @version      0.2
// @description  try to take over the world!
// @author       Samu
// @match        http://bakabt.me/torrent/*
// @match        https://bakabt.me/torrent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27004/Allow%20leaching%20on%20BakaBT%20%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/27004/Allow%20leaching%20on%20BakaBT%20%3A.meta.js
// ==/UserScript==

username = "abcabcabc";
password = "DAWKYh24ciouadwt987iu34rgythgrw4ger";

var downloadLink = document.querySelector(".download_link");
var downloadLinkText = document.querySelector(".download_link_text");

downloadLink.style.width = "450px";

var dl = document.createElement("div");
dl.setAttribute("style", "cursor: pointer;background-size: contain;display: inline-block;background-color: #517B27;height: 26px;width: 26px;background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8AAADU1NQ0NDTIyMiOjo67u7u+vr55eXnY2NhYWFj7+/vr6+tGRkbn5+fx8fGHh4crKysMDAyioqKysrIvLy9dXV2BgYGrq6tRUVGbm5txcXFBQUGKiorg4OBfX18hISEXFxdnZ2clJSWptfAFAAADnklEQVR4nO3d21bqMBSFYU4q0EoBRQQUBd//HffWULClzaFJxprB+V17kX8oKU1q2utFNHtfLftmq20WcxQR7S3qlKn0UDu6sy7sz6TH2s3cvnAkPdZuHH6HLATFQhbiYyEL8bGQhfhYyEJ8LGQhPhayEB8LWYiPhSzEx0IW4mMhC/GxkIX4WMhCfCxkIT4WshAfC1mIj4UsxMdCFuJjIQvxsZCF+FjIQnwsZCE+FrIQHwtZiI+Ff6pwID3WbhwKH6eNjuNn6Yhv+aTZfmxfqGmXzsuCZOhMhAsnsQP7uXDhLHbgWDjQaTrpYglwwNIwauFeOu+//BAx8F667kfEyWYu3XbyECtQ/Fp4to1UWEiHXRyjBEJ9HX+LEHgnHVVRfAYP3Eg31QSfUJdAH0LlPnAh1IdQCfv1bSud0yTkhPohHdMoCzehfsJ9CJUiWCHssk2oCfVJOqTdc5DAo3SGjsOhrK0WoB/Ckxf/QumlJ5OFb+CrdIGJ79LUTjrAbOQVuAJYeTJ69SlEWHkyW3cPhNimsLDpGii//Gsp++oWOJQeuL2OE2pKZ893mlAxln9tPbkHoiz/2nLeV8RZ/rXlOKHirTwZFW4TKuxNr4b9K0r6oCtPRg4TKvRNr4b1js1XCt+3G+0sC9P4vt3IboExle/bTYqDReBaepReLBYY36TH6Mm8YyP9SJA3044N4CaTK/2OTZqX+irtjg3mJpOrXFOY7KW+qn1CTfhSX9W2Y5Pypb7mvTEw7Ut9zUdDYHp39TrZ9UOaCd7Va11PqCne1WvV74fhd9HcVXdsbmqWKf3eAkd7ai2Q6TlweCPfZeqyQzmNJn/H1GZ2ekgT/WEED8X37unmZn+DP/JJSntoBGOwG2tgb+vNdUPflTOafjlsIVpgon8Eq9xV1hdiPz6g/7+yh9NPsRAZCxUWImOhwkJkLFRYiIyFCguRsVBhITIWKixExkKFhchYqLAQGQsVFiJjocJCZCxUWIiMhQoLkbFQYSEyFiosRMZChYXIWKgYnhEeINM/I2xXmDIWpo+F6WNh+liYPhamj4XpY2H6ykK/U9SRlSelOR00mpTyGKpMeiDRnBc7vN/YAOryT9qR37Qp5vLmtvgvhJXx64CRqfmnEzS9BPYG0oOJonJGjMcrKWDVTqJ6lB5PcPXz7hxPUMd3/dao7LZmm5emo7ZivRFWQsvJtvmtzDfr9oOostF8s1pKD9DDcrWZj6p/oP8A6CVYPbIs9QIAAAAASUVORK5CYII=');");
downloadLinkText.parentElement.insertBefore(dl, downloadLinkText);

dl.addEventListener("click", function() {
    $.post("https://bakabt.me/logout.php", function(){
        $.post(document.location.href, function(data) {
            var downLink = $(data).find(".download_link")[0].href;
            document.location = downLink;
            $.post("https://bakabt.me/login.php", {username: username, password: password});
        });
    });
    
});