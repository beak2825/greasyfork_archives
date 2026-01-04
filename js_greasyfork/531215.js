// ==UserScript==
// @name         屏蔽勋章
// @namespace    http://tampermonkey.net/
// @version      1.0.9.1
// @description  屏蔽勋章及缩略图显示
// @author       St
// @match        *://*.xingyunge.top/details.php*
// @match        *://xingyunge.top/torrents.php*
// @match        *://xingyunge.top/staffbox.php*
// @match        *://xingyunge.top/edit.php?id=*
// @match        *://*.xingyungept.org/details.php*
// @match        *://pt.xingyungept.org/torrents.php*
// @match        *://pt.xingyungept.org/staffbox.php*
// @match        *://pt.xingyungept.org/edit.php?id=*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xingyunge.top
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531215/%E5%B1%8F%E8%94%BD%E5%8B%8B%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/531215/%E5%B1%8F%E8%94%BD%E5%8B%8B%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //     var showMedal = true;
    //     var showPreview = true;

    let showMedal = GM_getValue("showMedal");
    let showPreview = GM_getValue("showPreview");


    registerMenuCommand();
    // 注册脚本菜单
    function registerMenuCommand() {
        GM_registerMenuCommand(`${ GM_getValue("showMedal", false) ? '✅':'❌'} 显示勋章`, function(){
            showMedal = !showMedal;
            GM_setValue("showMedal", showMedal);
            location.reload();
        });

        GM_registerMenuCommand(`${ GM_getValue("showPreview", false) ? '✅':'❌'} 显示缩略图`, function(){
            showPreview = !showPreview;
            GM_setValue("showPreview", showPreview);
            location.reload();
        });

    }


    function hideMedalElements() {
        const elementMedal = document.querySelectorAll('.nexus-username-medal.preview');
        // 遍历选中的元素
        elementMedal.forEach(function (element) {
            // 隐藏每个元素
            element.style.display = 'none';
        });
    }

    function hideImageParentElements() {
        const images = document.querySelectorAll('img.nexus-lazy-load.preview');
        images.forEach((image) => {
            try {
                const parentElement = image.parentElement;
                if (parentElement) {
                    parentElement.style.display = 'none';
                }
            } catch (error) {
                console.error('在隐藏上级元素时出现错误:', error);
            }
        });
    }

    if(!showPreview){
        hideMedalElements();
        window.addEventListener('load', () => {
            hideMedalElements();
        });

        window.addEventListener('scroll', () => {
            hideMedalElements();
        });



    }

    if(!showPreview){
        hideImageParentElements();
        window.addEventListener('load', () => {
            hideImageParentElements();
        });

        window.addEventListener('scroll', () => {
            hideImageParentElements();
        });



    }
    const REGEX_PATTERN = /^https:\/\/.*xingyunge.*\/edit.php/;
    if (REGEX_PATTERN.test(window.location.href)) {
        addEditLink();
        addCopyLink();
        //console.log('当前页面 URL 匹配成功');
    }

   const REGEX_PATTERN2 = /^https:\/\/.*xingyunge.*\/torrents.php.*(\?.*)?$/;;
    if (REGEX_PATTERN2.test(window.location.href)) {
        addBatchOpen();
        //console.log('当前页面 URL 匹配成功');
    }


    //     const links = document.querySelectorAll('table.torrentname a');
    //     links.forEach(link => {
    //         link.addEventListener('click', function () {
    //             this.style.color ='red';
    //         });
    //     });


    function addEditLink() {
        const targetElement = document.querySelector('input[name="nfo"]');
        if (targetElement) {

            // 获取编辑元素
            const edit = document.querySelector('input[type="submit"]');
            // 创建编辑按钮元素
            const editButton = document.createElement('button');
            // 设置按钮文本
            editButton.textContent = '编辑';
            // 为按钮添加点击事件监听器
            editButton.addEventListener('click', function editSubmit() {
                // 提交表单
                edit.click();
            });

            // 在文件输入框后插入编辑按钮
            targetElement.parentNode.insertBefore(editButton, targetElement.nextSibling);


        }
    }
    //年份季数顺序对调
    function reorderString(str) {
        const regex = /(.*?)(\d{4}(?: )?)(S\d+(?:E\d+ | Complete |E\d+-E\d+ | )?)(.*)/;
        //const regex = /(.*?)(\d{4}(?: )?)(S\d+(?:E\d+ | Complete |E\d+-E\d+ | )?)(.*)/;
        return str.replace(regex, '$1$3$2$4');
    }

    function addCopyLink() {
        const targetElement2 = document.querySelector('input[name="nfo"]');
        if (targetElement2) {


            // 创建编辑按钮元素
            const titleButton = document.createElement('button');
            // 设置按钮文本
            titleButton.textContent = '替换标题';
            titleButton.type = 'button'; // 避免默认提交行为
            // 为按钮添加点击事件监听器
            titleButton.addEventListener('click', function replaceStr() {
                // 替换标题
                var title = document.querySelector('input[name="name"]').value;
                document.querySelector('input[name="name"]').value=reorderString(title);
            });

            // 在文件输入框后插入编辑按钮
            targetElement2.parentNode.insertBefore(titleButton, targetElement2.nextSibling);

        }

    }
    /*     // 创建一个输入框和按钮
    const input = document.createElement('input');
    input.type = 'number';
    input.value = 5;
    input.placeholder = '输入要打开的网页数量';
    input.style.marginRight = '10px';

    const select = document.createElement('select');
    const types = ['全部', '动漫', '电影','综艺','电视剧','纪录片'];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
    });
    select.style.marginRight = '10px';

    const button = document.createElement('button');
    button.textContent = '随机打开';

    // 创建一个容器并添加元素
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.padding = '10px';
    container.style.backgroundColor = '#f0f0f0';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
    container.style.zIndex = '9999';

    container.appendChild(input);
    container.appendChild(select);
    container.appendChild(button);
    document.body.appendChild(container);

    // 点击按钮时执行的函数
    button.addEventListener('click', function() {
        const count = parseInt(input.value);
        const selectedType = select.value;
        const rows = document.querySelectorAll('table.torrents tr:not(:first-child)');
        let filteredRows = [];

        if (selectedType === '全部') {
            filteredRows = Array.from(rows);
        } else {
            rows.forEach(row => {
                const typeImg = row.querySelector('td.rowfollow.nowrap a img');
                if (typeImg && typeImg.title === selectedType) {
                    filteredRows.push(row);
                }
            });
        }
        console.log(filteredRows.length)
        //const shuffledRows = filteredRows.sort(() => 0.5 - Math.random());
        const rowsToOpen = filteredRows.slice(0, count);

        rowsToOpen.forEach(row => {
            const link = row.querySelector('td.rowfollow a[href^="details.php"]');
            if (link) {
                console.log('打开链接:', link.href);
                window.open(link.href, '_blank', 'noopener,noreferrer');

            }
        });
    }); */

    //功能3 start
    //适合移动端
    function addBatchOpen() {
        // 创建一个输入框和按钮
        const input = document.createElement('input');
        input.type = 'number';
        input.value = 5;
        input.placeholder = '输入要打开的网页数量';
        input.min = '1';
        input.max = '50';
        input.id = 'countInput';
        input.style.cssText = `
  width: 100%;
  padding: 8px 12px;
  margin: 4px 0 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
`;

          const select = document.createElement('select');
          select.id = 'typeSelect';
          select.style.cssText = `
  width: 100%;
  padding: 8px 12px;
  margin: 4px 0 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
`;

          const types = ['全部', '动漫', '电影', '综艺', '电视剧', '纪录片'];
          types.forEach(type => {
              const option = document.createElement('option');
              option.value = type;
              option.textContent = type;
              select.appendChild(option);
          });

          const button = document.createElement('button');
          button.textContent = '随机打开';
          button.id = 'openButton';
          button.style.cssText = `
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 10px 16px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.1s;
`;

          // 添加触摸反馈效果
          button.addEventListener('touchstart', function() {
              this.style.backgroundColor = '#45a049';
              this.style.transform = 'scale(0.98)';
          });

          button.addEventListener('touchend', function() {
              this.style.backgroundColor = '#4CAF50';
              this.style.transform = 'scale(1)';
          });

          button.addEventListener('mousedown', function() {
              this.style.backgroundColor = '#45a049';
          });

          button.addEventListener('mouseup', function() {
              this.style.backgroundColor = '#4CAF50';
          });

          // 创建状态提示元素
          const status = document.createElement('div');
          status.id = 'statusMessage';
          status.style.cssText = `
  padding: 8px 0;
  font-size: 13px;
  color: #666;
  display: none;
`;

          // 创建一个容器并添加元素
          const container = document.createElement('div');
          container.id = 'randomOpenerContainer';
          container.style.cssText = `
  position: fixed;
  top: 16px;
  right: 16px;
  padding: 12px 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
  width: 280px;
  max-width: calc(100% - 32px);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #eee;
`;

          // 容器悬停效果
          container.addEventListener('mouseenter', function() {
              this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
              this.style.transform = 'translateY(-2px)';
          });

          container.addEventListener('mouseleave', function() {
              this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              this.style.transform = 'translateY(0)';
          });

          container.appendChild(input);
          container.appendChild(select);
          container.appendChild(button);
          container.appendChild(status);
          document.body.appendChild(container);

          // 添加数字输入验证
          input.addEventListener('input', function() {
              this.value = this.value.replace(/[^0-9]/g, '');
              if (this.value < 1) this.value = 1;
              if (this.value > 50) this.value = 50;
          });

          // 点击按钮时执行的函数
          button.addEventListener('click', function() {
              // 验证输入
              let count = parseInt(input.value);
              if (isNaN(count) || count < 1) {
                  count = 1;
                  input.value = 1;
              } else if (count > 50) {
                  count = 50;
                  input.value = 50;
              }

              const selectedType = select.value;
              const rows = document.querySelectorAll('table.torrents tr:not(:first-child)');
              let filteredRows = [];

              // 过滤符合条件的行
              if (selectedType === '全部') {
                  filteredRows = Array.from(rows);
              } else {
                  rows.forEach(row => {
                      const typeImg = row.querySelector('td.rowfollow.nowrap a img');
                      if (typeImg && typeImg.title === selectedType) {
                          filteredRows.push(row);
                      }
                  });
              }

              // 随机排序并选择指定数量的行
              const shuffledRows = filteredRows.sort(() => 0.5 - Math.random());
              const rowsToOpen = shuffledRows.slice(0, count);

              // 显示状态
              status.textContent = `找到 ${filteredRows.length} 个结果，正在打开 ${rowsToOpen.length} 个链接...`;
              status.style.display = 'block';
              status.style.color = '#2563eb';

              // 打开链接
              let successCount = 0;
              let failCount = 0;

              rowsToOpen.forEach((row, index) => {
                  const link = row.querySelector('td.rowfollow a[href^="details.php"]');
                  if (link) {
                      setTimeout(() => {
                          try {
                              window.open(link.href, '_blank', 'noopener,noreferrer');
                              successCount++;
                          } catch (e) {
                              console.error('打开链接失败:', e);
                              failCount++;
                          }

                          // 更新状态
                          if (index === rowsToOpen.length - 1) {
                              setTimeout(() => {
                                  status.textContent = `成功打开 ${successCount} 个链接，失败 ${failCount} 个`;
                                  status.style.color = '#16a34a';

                                  // 3秒后隐藏状态
                                  setTimeout(() => {
                                      status.style.display = 'none';
                                  }, 3000);
                              }, 500);
                          }
                      }, index * 200); // 每200ms打开一个链接，避免浏览器阻止
                  }
              });
          });

          // 页面加载动画
          window.addEventListener('load', function() {
              container.style.opacity = '0';
              container.style.transform = 'translateY(20px)';

              setTimeout(() => {
                  container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                  container.style.opacity = '1';
                  container.style.transform = 'translateY(0)';
              }, 100);
          });
      };
    //功能3 end

})();