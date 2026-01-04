// ==UserScript==
// @name         Предпросмотр серии на jut.su
// @version      1.0
// @description  Наведитесь на кнопку серии чтобы посмотреть названия и кадр
// @author       nab._. nab#9255
// @match        *://jut.su/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jut.su
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/228105
// @downloadURL https://update.greasyfork.org/scripts/474871/%D0%9F%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20%D1%81%D0%B5%D1%80%D0%B8%D0%B8%20%D0%BD%D0%B0%20jutsu.user.js
// @updateURL https://update.greasyfork.org/scripts/474871/%D0%9F%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20%D1%81%D0%B5%D1%80%D0%B8%D0%B8%20%D0%BD%D0%B0%20jutsu.meta.js
// ==/UserScript==
setTimeout(() => {
    let style = document.createElement('style');
    style.innerHTML = `
    #prevbox{
  margin-top: 55px;
  margin-left: -163px;
}
#prevbox > div{
  border-radius: 0 0 5px 5px;
  top: 10px;
  padding: 3px 14px;
  background-color: #363a37;
  min-height: max-content;
  border-top: 1px solid #505550;
}
#prevbox::before{
  left:-5px;
}
#prevbox::after{
  right: -5px;
}
#prevbox::after,
#prevbox::before{
 content: "" !important;
    display: inline-block;
    position: absolute;
    margin-top: -10px;
    top:5px;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    border: 1px solid #666b66;
    background-color: #363a37;
}

        #prevbox > img{
            background: url(https://i.imgur.com/DLLjUig.png) center no-repeat rgb(54, 58, 55);
        }
        #prevbox{
            display: none;
            width: 200px;
            height: auto;
            position: absolute;
            z-index: 9999;
            opacity: 0;
            transition: all 0.2s ease 0s;
            box-shadow: black 0px 0px 15px;
            border-radius: 5px;
            border: 2px solid rgba(102, 107, 102, 0.8);
            text-align: center;
        }`
    document.head.append(style);
    const linkElements = document.querySelectorAll(`#dle-content > div > div:nth-child(2) > a[href*='${window.location.pathname}']`);

    linkElements.forEach(linkElement => {
        let timeoutId = null;
        let timeoutId2 = null;
        let prevbox = document.createElement('div');
        const imgElement = document.createElement('img');
        const nameBox = document.createElement('div');
        const nameElement = document.createElement('text');
        nameBox.append(nameElement);

        prevbox.id = "prevbox";
        imgElement.style.width = '200px';
        imgElement.style.height = '112.5px';


        let loaded = false;

        if (localStorage[linkElement.href] && localStorage[linkElement.href + "name"]) {
            loaded = true;
            imgElement.src = localStorage[linkElement.href];
            nameElement.innerText = localStorage[linkElement.href + "name"];

            prevbox.prepend(nameBox);
            prevbox.prepend(imgElement);
            linkElement.insertAdjacentElement('afterend', prevbox);
        }
        linkElement.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);

            timeoutId = setTimeout(() => {
                if (!loaded) {
                    loaded = true;
                    fetch(linkElement.href)
                        .then(response => response.arrayBuffer())
                        .then(buffer => {
                            prevbox.prepend(nameBox);
                            prevbox.prepend(imgElement);
                            linkElement.insertAdjacentElement('afterend', prevbox);
                            let html = new TextDecoder('windows-1251').decode(buffer);
                            const doc = document.createElement("test");
                            doc.innerHTML = html;
                            const imgUrl = doc.querySelector(`meta[property="og:image"]`).content;
                            console.log(doc.querySelector("#dle-content div.video_plate_title h2"));
                            const nameText = doc.querySelector("#dle-content div.video_plate_title h2").innerHTML;
                            nameElement.innerText = nameText;
                            localStorage[linkElement.href + "name"] = nameText;
                            imgElement.src = imgUrl;

                            localStorage[linkElement.href] = imgUrl;
                        })
                        .catch(error => {
                            loaded = false;
                            console.error(error);
                        });
                }
                prevbox.style.opacity = '0';
                prevbox.style.display = "unset";
            }, 200);
            timeoutId2 = setTimeout(() => {
                prevbox.style.opacity = '1';
            }, 500)

        });

        linkElement.addEventListener('mouseleave', () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
            prevbox.style.opacity = '0';
            setTimeout(() => {
                prevbox.style.display = "none";
            }, 200)
        });
    });
}, 1000);