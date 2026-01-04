// ==UserScript==
// @name         OPPO转换器
// @namespace    http://tampermonkey.net/
// @version      2024-07-20
// @description  再也不用费力拉
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oppoer.me
// @match        *://*.oppo.com/*
// @grant        GM_addStyle
// @license     GNU GPLv3
// @author        Paul
// @downloadURL https://update.greasyfork.org/scripts/500411/OPPO%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/500411/OPPO%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var btnContainer = document.createElement('div');
    btnContainer.style.position = 'fixed';
    btnContainer.style.top = '30%';
    btnContainer.style.left = '0';
    btnContainer.style.transform = 'translateY(-50%)';
    btnContainer.style.zIndex = '1000';
    btnContainer.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    btnContainer.style.padding = '10px';
    btnContainer.style.borderRadius = '0 5px 5px 0';
    btnContainer.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
    btnContainer.style.transition = 'transform 0.3s';
    btnContainer.style.transform = 'translateX(-93%)';

    var btn1 = document.createElement('button');
    btn1.innerText = '现网↔AEM后台';
    btn1.style.display = 'block';
    btn1.style.marginBottom = '10px';
    btnContainer.appendChild(btn1);

    var btn2 = document.createElement('button');
    btn2.innerText = '编辑此页面';
    btn2.style.display = 'block';
    btn2.style.marginBottom = '10px';
    btnContainer.appendChild(btn2);

    var btn3 = document.createElement('button');
    btn3.innerText = 'pre模式';
    btn3.style.display = 'block';
    btn3.style.marginBottom = '10px';
    btnContainer.appendChild(btn3);

    var btn4 = document.createElement('button');
    btn4.innerText = 'disabled模式';
    btn4.style.display = 'block';
    btn4.style.marginBottom = '10px';
    btnContainer.appendChild(btn4);

    var btn5 = document.createElement('button');
    btn5.innerText = '参数页源数据';
    btn5.style.display = 'block';
    btn5.style.marginBottom = '10px';
    btnContainer.appendChild(btn5);

    document.body.appendChild(btnContainer);

    btnContainer.addEventListener('mouseenter', function() {
        btnContainer.style.transform = 'translateX(0)';
    });

    btnContainer.addEventListener('mouseleave', function() {
        btnContainer.style.transform = 'translateX(-93%)';
    });

    // 生成新网址规则函数
    function generateNewUrl(url) {
        if (url.startsWith("https://www.oppo.com")) {
            if (!url.includes("/content/")) {
                var newUrl = url.replace("https://www.oppo.com", "https://cms.oppo.com/sites.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;
            }
        } else if (url.startsWith("https://oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("https://oppo.com", "https://cms.oppo.com/sites.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;
            }
        } else if (url.startsWith("https://pre-www.oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("https://pre-www.oppo.com", "https://cms.oppo.com/sites.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;
            }
        } else if (url.startsWith("pre-www.oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("pre-www.oppo.com", "https://cms.oppo.com/sites.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;
            }
        } else if (url.startsWith("www.oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("www.oppo.com", "https://cms.oppo.com/sites.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;
            }
        } else if (url.startsWith("oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("oppo.com/", "https://cms.oppo.com/sites.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;
            }
        }

        if (url.startsWith("https://cms.oppo.com/sites.html/content/")) {
             newUrl = url.replace("https://cms.oppo.com/sites.html/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            return newUrl;
        }

        if (url.startsWith("https://cms.oppo.com/editor.html/")) {
             newUrl = url.replace("https://cms.oppo.com/editor.html/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".html")) newUrl = newUrl.replace(".html", "");
            return newUrl;
        }

        if (url.startsWith("https://cms.oppo.com/content/")) {
             newUrl = url.replace("https://cms.oppo.com/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("?wcmmode=disabled")) newUrl = newUrl.replace("?wcmmode=disabled", "");
            return newUrl;
        }

        if (url.startsWith("cms.oppo.com/sites.html/content/")) {
             newUrl = url.replace("https://cms.oppo.com/sites.html/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            return newUrl;
        }

        if (url.startsWith("cms.oppo.com/editor.html/")) {
             newUrl = url.replace("cms.oppo.com/editor.html/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            return newUrl;
        }

        if (url.startsWith("cms.oppo.com/content/")) {
             newUrl = url.replace("cms.oppo.com/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("?wcmmode=disabled")) newUrl = newUrl.replace("?wcmmode=disabled", "");
            return newUrl;
        }

        if (url.startsWith("https://image.oppo.com/content/")) {
             newUrl = url.replace("https://image.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("https://pre-image.oppo.com/content/")) {
             newUrl = url.replace("https://pre-image.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("https://www.oppo.com/content/")) {
             newUrl = url.replace("https://www.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("https://pre-www.oppo.com/content/")) {
             newUrl = url.replace("https://pre-www.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("image.oppo.com/content/")) {
             newUrl = url.replace("image.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("pre-image.oppo.com/content/")) {
             newUrl = url.replace("pre-image.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("www.oppo.com/content/")) {
             newUrl = url.replace("www.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("pre-www.oppo.com/content/")) {
             newUrl = url.replace("pre-www.oppo.com/content/", "https://cms.oppo.com/assets.html/content/");
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("https://cms.oppo.com/assetdetails.html/")) {
             newUrl = url.replace("https://cms.oppo.com/assetdetails.html/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("https://cms.oppo.com/assets.html/")) {
             newUrl = url.replace("https://cms.oppo.com/assets.html/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("cms.oppo.com/assetdetails.html/")) {
             newUrl = url.replace("https://cms.oppo.com/assetdetails.html/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        if (url.startsWith("cms.oppo.com/assets.html/")) {
             newUrl = url.replace("https://cms.oppo.com/assets.html/", "https://www.oppo.com/");
            if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            if (newUrl.endsWith(".thumb.webp")) newUrl = newUrl.replace(".thumb.webp", "");
            return newUrl;
        }

        return null;
    }

    function generateNewUrl2(url) {
        if (url.startsWith("https://www.oppo.com")) {
            if (!url.includes("/content/")) {
                var newUrl = url.replace("https://www.oppo.com", "https://cms.oppo.com/editor.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";
            }
        } else if (url.startsWith("https://oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("https://oppo.com", "https://cms.oppo.com/editor.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";
            }
        } else if (url.startsWith("https://pre-www.oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("https://pre-www.oppo.com", "https://cms.oppo.com/editor.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";
            }
        } else if (url.startsWith("pre-www.oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("pre-www.oppo.com", "https://cms.oppo.com/editor.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";
            }
        } else if (url.startsWith("www.oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("www.oppo.com", "https://cms.oppo.com/editor.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";
            }
        }else if (url.startsWith("cms.oppo.com/sites.html")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("cms.oppo.com/sites.html", "https://cms.oppo.com/editor.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";
            }
        } else if (url.startsWith("oppo.com")) {
            if (!url.includes("/content/")) {
                 newUrl = url.replace("oppo.com/", "https://cms.oppo.com/editor.html/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";
            }
        }

        if (url.startsWith("https://cms.oppo.com/editor.html/")) {
            newUrl = "姐妹你所在的页面就是编辑网址啊";
            alert(newUrl);
        }

         if (url.startsWith("https://cms.oppo.com/sites.html")) {
              newUrl = url.replace("https://cms.oppo.com/sites.html", "https://cms.oppo.com/editor.html");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html";

         }



         if (url.startsWith("https://cms.oppo.com/content/")) {
              newUrl = url.replace("https://cms.oppo.com/content/oppo/", "https://cms.oppo.com/editor.html/content/oppo/");
             newUrl = newUrl.replace("?wcmmode=disabled", "");
                return newUrl;

         }

        return null;
    }


    function generateNewUrl3(url) {
        if (url.startsWith("https://www.oppo.com")) {
            var newUrl = url.replace("www.oppo.com", "pre-www.oppo.com");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;

        }

         if (url.startsWith("https://cms.oppo.com/sites.html")) {
              newUrl = url.replace("https://cms.oppo.com/sites.html/content/oppo", "https://pre-www.oppo.com/");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;

         }
        if (url.startsWith("https://pre-www.oppo.com")) {
              newUrl = url.replace("https://pre-www.oppo.com", "https://www.oppo.com/");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;

         }
        if (url.startsWith("https://cms.oppo.com/content")) {
              newUrl = url.replace("https://cms.oppo.com/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("?wcmmode=disabled")) newUrl = newUrl.replace("?wcmmode=disabled", "");
            return newUrl;

         }


        if (url.startsWith("https://cms.oppo.com/editor.html/content")) {
              newUrl = url.replace("https://cms.oppo.com/editor.html/content/oppo/", "https://pre-www.oppo.com/");
newUrl = newUrl.replace(".html", "");
            return newUrl;

         }

        return null;
    }

    function generateNewUrl4(url) {
        if (url.startsWith("https://www.oppo.com")) {
            var newUrl = url.replace("www.oppo.com", "cms.oppo.com/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html?wcmmode=disabled";

        }

        if (url.startsWith("https://cms.oppo.com/content")) {
              newUrl = url.replace("https://cms.oppo.com/content/oppo/", "https://www.oppo.com/");
            if (newUrl.endsWith("?wcmmode=disabled")) newUrl = newUrl.replace("?wcmmode=disabled", "");
            return newUrl;

         }

         if (url.startsWith("https://cms.oppo.com/sites.html")) {
              newUrl = url.replace("https://cms.oppo.com/sites.html/content/oppo", "https://cms.oppo.com/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl + ".html?wcmmode=disabled";

         }
          if (url.startsWith("https://pre-www.oppo.com")) {
              newUrl = url.replace("https://pre-www.oppo.com", "https://cms.oppo.com/content/oppo");
                if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);

                return newUrl + ".html?wcmmode=disabled";

         }

          if (url.startsWith("https://cms.oppo.com/editor.html/content")) {
              newUrl = url.replace("/editor.html/", "/");
 return newUrl + "?wcmmode=disabled";



         }


        return null;
    }


    function generateNewUrl5(url) {

        //正式环境下跳转
            //手机产品
        if (url.startsWith("https://www.oppo.com")) {
            var newUrl = url.replace("https://www.oppo.com/", "https://cms.oppo.com/sites.html/content/oppo-product/");

                newUrl = newUrl.replace("smartphones/", "");
             if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;

        }
        //预览模式下跳转
        if (url.startsWith("https://cms.oppo.com/content")) {
              newUrl = url.replace("https://cms.oppo.com/content/oppo/", "https://cms.oppo.com/sites.html/content/oppo-product/");
            if (newUrl.endsWith("?wcmmode=disabled")) newUrl = newUrl.replace("?wcmmode=disabled", "");
             newUrl = newUrl.replace("smartphones/", "");
             if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
            return newUrl;

         }
       //pre模式下跳转
          if (url.startsWith("https://pre-www.oppo.com")) {
              newUrl = url.replace("https://pre-.oppo.com/", "https://cms.oppo.com/sites.html/content/oppo-product/");

                newUrl = newUrl.replace("smartphones/", "");
             if (newUrl.endsWith("/")) newUrl = newUrl.slice(0, -1);
                return newUrl;
         }
        return null;
    }

    btn1.addEventListener('click', function() {
        var url = window.location.href;
        var newUrl = generateNewUrl(url);
        if (newUrl) {
            window.open(newUrl, '_blank');
        } else {
            alert("这不是OPPO官网");
        }
    });

    btn2.addEventListener('click', function() {
        var url = window.location.href;
        var newUrl = generateNewUrl2(url);
        if (newUrl) {
            window.open(newUrl, '_blank');
        } else {
            alert("这不是OPPO官网");
        }
    });

    btn3.addEventListener('click', function() {
        var url = window.location.href;
        var newUrl = generateNewUrl3(url);
        if (newUrl) {
            window.open(newUrl, '_blank');
        } else {
            alert("这不是OPPO官网");
        }
    });

    btn4.addEventListener('click', function() {
        var url = window.location.href;
        var newUrl = generateNewUrl4(url);
        if (newUrl) {
            window.open(newUrl, '_blank');
        } else {
            alert("这不是OPPO官网");
        }
    });

    btn5.addEventListener('click', function() {
        var url = window.location.href;
        var newUrl = generateNewUrl5(url);
        if (newUrl) {
            window.open(newUrl, '_blank');
        } else {
            alert("这不是OPPO官网");
        }
    });

})();