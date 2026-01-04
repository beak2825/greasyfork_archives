// ==UserScript==
// @name         grajapa日本写真网 自动下载工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  grajapa 写真网 免去繁琐操作 一键下载所有图片
// @author       hg542006810
// @match        https://www.grajapa.shueisha.co.jp/viewerV3_5/
// @icon         https://www.google.com/s2/favicons?domain=shueisha.co.jp
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.6.0/jszip.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/437187/grajapa%E6%97%A5%E6%9C%AC%E5%86%99%E7%9C%9F%E7%BD%91%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/437187/grajapa%E6%97%A5%E6%9C%AC%E5%86%99%E7%9C%9F%E7%BD%91%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(
          '#grajapa_download{position: absolute; z-index: 10000; top: 100px; right: 400px; background: red;color: white;}'
        );

        // 生成下载按钮
        var button = document.createElement('button');
        button.id = 'grajapa_download';
        button.textContent = '一键下载';

        button.onclick = async () => {
          // 获得所有图片
          async function getImages(index, sum, allImages) {
            var images = [];
            // 点击切换图片
            $('.list-group-item')[index].click();
            $('.fixed-book-frame').each(function () {
              $(this)
                .find('iframe')
                .each(function () {
                  $(this)
                    .contents()
                    .find('image')
                    .each(function () {
                      var link = $(this).attr('xlink:href');
                      if (
                        allImages.indexOf(link) !== -1 ||
                        images.indexOf(link) !== -1
                      ) {
                        return;
                      }
                      images.push(link);
                    });
                });
            });
            if (index + 1 < sum) {
                // 等待1秒后继续执行
                await new Promise((resolve, reject) => {
                    setTimeout(() => resolve('await'), 1000)
                });
              allImages = allImages.concat(images);
              images = images.concat(await getImages(index + 1, sum, allImages));
            }
            return images;
          }
          var itemCount = $('.list-group-item').length;
          if (itemCount === 0) {
            alert('没有找到图片!');
          }
          var images = await getImages(0, itemCount, []);
          if (images.length === 0) {
            alert('没有找到图片!');
          }
          var zip = new JSZip();
          var img = zip.folder('images');
          images.forEach(function (item, index) {
            if (item.indexOf('data:image/jpeg;base64,') !== -1) {
              img.file(
                index + '.jpeg',
                item.replace('data:image/jpeg;base64,', ''),
                { base64: true }
              );
            }
            if (item.indexOf('data:image/jpg;base64,') !== -1) {
              img.file(
                index + '.jpg',
                item.replace('data:image/jpg;base64,', ''),
                { base64: true }
              );
            }
            if (item.indexOf('data:image/png;base64,') !== -1) {
              img.file(
                index + '.png',
                item.replace('data:image/png;base64,', ''),
                { base64: true }
              );
            }
          });
          zip
            .generateAsync({ type: 'blob' })
            .then(function (content) {
              const a = document.createElement('a');
              a.href = URL.createObjectURL(content);
              a.download = 'pictures.zip';
              a.click();
            })
            .catch(function (err) {
              alert('发生了错误!' + err);
            });
        };

        document.body.appendChild(button);

})();