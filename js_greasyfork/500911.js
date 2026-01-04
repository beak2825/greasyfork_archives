// ==UserScript==
// @name 微商相册自动转发
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 可以在微商相册自动转发并且修改价格
// @author CaloxNg
// @license GPL-v3.0
// @include /https://www.szwego.com/.*/
// @icon https://img.alicdn.com/imgextra/i4/O1CN01FOwagl1XBpyVA2QVy_!!5000000002886-2-tps-512-512.png
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/500911/%E5%BE%AE%E5%95%86%E7%9B%B8%E5%86%8C%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/500911/%E5%BE%AE%E5%95%86%E7%9B%B8%E5%86%8C%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%8F%91.meta.js
// ==/UserScript==
//使用说明
//选择多图列表模式
//1.手动一键填充:
//1.1打开商品编辑页,输入分类名称,输入价格倍数,点击手动一键填充即可
//2.开始转发
//2.1打开到店面,滑动到哪里就从哪里开始转发
//2.2填入店面地址,如果需要日期检测就打钩,输入分类名称,输入价格倍数,点击开始直接转发即可
//3.开始到底转发
//3.1打开到店面
//3.2打钩到底转发,填入店面地址,如果需要日期检测就打钩,输入分类名称,输入价格倍数,点击开始转发即可
(function () {
  // 等待页面完全加载
  window.onload = function () {
    // 创建插件页面----------------------------------------------------------
    // 创建容器
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.right = '0';
    container.style.bottom = '80px';
    container.style.backgroundColor = '#f5f6ff';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.style.overflow = 'auto';
    container.style.maxWidth = '250px';
    container.style.boxSizing = 'border-box';

    // 标题为"地址栏筛选"的单选框和输入框
    let dizhiDiv = document.createElement('div');
    dizhiDiv.innerHTML = `
            <label style="display: block;">
            <input type="checkbox" id="daodiCheckbox"> 到底转发
            </label>
            <label style="display: block;">
                <input type="checkbox" id="dizhiCheckbox"> 地址栏检测
            </label>
            <input type="text" id="dizhiInput" placeholder="输入地址" style="width: calc(100% - 10px);">

        `;
    container.appendChild(dizhiDiv);

    // 标题为"日期筛选"的单选框和输入框
    let riqiDiv = document.createElement('div');
    riqiDiv.innerHTML = `
            <label style="display: block;">
                <input type="checkbox" id="riqiCheckbox"> 日期检测
            </label>
        `;
    container.appendChild(riqiDiv);

    // 标题为"分类输入框"的输入框
    let fenleiDiv = document.createElement('div');
    fenleiDiv.innerHTML = `
            <label style="display: block;">
                分类输入框:
            </label>
            <input type="text" id="fenleiInput" placeholder="输入分类" style="width: calc(100% - 10px);">
        `;
    container.appendChild(fenleiDiv);

    // 标题为"价格倍数"的输入框
    let jiageDiv = document.createElement('div');
    jiageDiv.innerHTML = `
            <label style="display: block;">
                价格倍数:
            </label>
            <input type="number" id="jiageInput" placeholder="输入倍数" style="width: calc(100% - 10px);margin-bottom:10px;">
        `;
    container.appendChild(jiageDiv);

    // 创建按钮区域，按钮可以一行两个排列
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'row';
    buttonContainer.style.flexWrap = 'wrap';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.gap = '10px';

    // "手动一键填充"按钮
    let shoudongtianchongBtn = document.createElement('button');
    shoudongtianchongBtn.textContent = '手动一键填充';
    shoudongtianchongBtn.style.padding = '8px 15px';
    shoudongtianchongBtn.style.backgroundColor = '#4CAF50';
    shoudongtianchongBtn.style.color = 'white';
    shoudongtianchongBtn.style.border = 'none';
    shoudongtianchongBtn.style.borderRadius = '4px';
    shoudongtianchongBtn.style.cursor = 'pointer';
    buttonContainer.appendChild(shoudongtianchongBtn);
    // "网页滚动到底"按钮
    let gundongdibuBtn = document.createElement('button');
    gundongdibuBtn.textContent = '网页滚动底部';
    gundongdibuBtn.style.padding = '8px 15px';
    gundongdibuBtn.style.backgroundColor = '#2196F3';
    gundongdibuBtn.style.color = 'white';
    gundongdibuBtn.style.border = 'none';
    gundongdibuBtn.style.borderRadius = '4px';
    gundongdibuBtn.style.cursor = 'pointer';
    buttonContainer.appendChild(gundongdibuBtn);

    // "开始转发"按钮
    let kaishizhuanfaBtn = document.createElement('button');
    kaishizhuanfaBtn.textContent = '开始转发';
    kaishizhuanfaBtn.style.padding = '8px 15px';
    kaishizhuanfaBtn.style.backgroundColor = '#FF9800';
    kaishizhuanfaBtn.style.color = 'white';
    kaishizhuanfaBtn.style.border = 'none';
    kaishizhuanfaBtn.style.borderRadius = '4px';
    kaishizhuanfaBtn.style.cursor = 'pointer';
    kaishizhuanfaBtn.style.width = '100%';
    buttonContainer.appendChild(kaishizhuanfaBtn);

    //按钮添加到页面中
    container.appendChild(buttonContainer);

    // 将容器添加到页面中
    document.body.appendChild(container);

    // 创建插件页面----------------------------------------------------------

    // 手动一键填充----------------------------------------------------------
    shoudongtianchongBtn.addEventListener('click', function () {
      //获取分类设置
      let fenleiInput = document.getElementById('fenleiInput');
      let fenleishezhi = fenleiInput.value.trim();
      //获取价格倍数
      let jiageInput = document.getElementById('jiageInput');
      let jiagebeishu = parseFloat(jiageInput.value.trim());
      //如果分类设置与价格倍数不为空
      if (fenleishezhi !== '' && jiagebeishu !== '') {
        //获取分类按钮
        let fenleianniu = document.querySelector('.weui_cell_ft');
        //如果分类标签不为空，则点击
        if (fenleianniu != null) {
          fenleianniu.click();
          //分类页面加载等待2秒进行
          setTimeout(() => {
            //分类页面获取所有的分类标签
            let fenleibiaoqian = document.querySelectorAll('.f12.word-break.g3');
            if (fenleibiaoqian.length > 0) {
              for (let item of fenleibiaoqian) {
                //是否与分类设置一样
                if (item.textContent.trim() === fenleishezhi) {
                  //如果是则点击,跳出循环
                  item.click();
                  //获取保存分类按钮
                  let wgooButtons = document.querySelectorAll('.wgoo-button');
                  if (wgooButtons != null) {
                    wgooButtons.forEach(button => {
                      let span = button.querySelector('.wgoo-button__content');
                      if (span && span.textContent.trim().includes('完成')) {
                        // 保存分类
                        button.click();
                      }
                    });
                  } else {
                    alert("未找到完成按钮")
                  }
                  //返回详情页等待2秒进行
                  setTimeout(() => {
                    // 获取详情描述框
                    let xiangqingkuang = document.querySelector('.weui_textarea')
                    //如果详情不等于空
                    if (xiangqingkuang != null) {
                      let xinjiage = 0
                      //获得价格框
                      let shoujiakuang = document.querySelector(
                        '.weui_input.text-right.error-color'
                      )
                      //获取详情内容
                      let jiuneirong = xiangqingkuang.value
                      //用正则表达式获取到带图标价格
                      let daichulijiage = jiuneirong.match(/(\d+)💰|💰(\d+)/)
                      if (daichulijiage != null) {
                        //获取纯价格
                        let yuanjiage = daichulijiage[1] || daichulijiage[2]
                        //新价格
                        xinjiage = yuanjiage * jiagebeishu
                        //把详情内容的价格进行替换得到新内容
                        jiuneirong = jiuneirong.replace(yuanjiage, xinjiage)
                      }
                      //用正则表达式匹配原市场
                      let daichulijiage2 = jiuneirong.match(
                        /原(价)?(本地)?(市场)?(💰)?(\d+)/
                      )
                      if (daichulijiage2 != null) {
                        //获取原市场
                        let yuanshichang = daichulijiage2[5]
                        //新市场
                        let xinshichang = yuanshichang * jiagebeishu
                        //把详情内容的价格进行替换得到新内容
                        jiuneirong = jiuneirong.replace(yuanshichang, xinshichang)
                      }
                      if (jiuneirong.includes('珂珂')) {
                        jiuneirong = jiuneirong.replace('珂珂', '雨墨');
                      }
                      //把新内容替换进详情描述框
                      changeReactInputValue(xiangqingkuang, jiuneirong)
                      //把新价格替换进售价输入框
                      if (shoujiakuang != null) {
                        changeReactInputValue(shoujiakuang, xinjiage)
                      }
                      // 点击保存按钮
                      let saveBtn = document.querySelector('div[data-bury-name="保存"]');
                      let primaryButton = saveBtn.querySelector('.wgoo-button__primary');
                      if (primaryButton != null) {
                        // 保存
                        primaryButton.click();
                        alert("完成");
                        return;
                      }
                    }
                  }, 3000); // 等待2秒
                }
              }
            } else {
              alert("未找到标签");
            }
          }, 3000); // 等待2秒
        } else {
          alert("不在详情页");
        }
      } else {
        alert('分类和倍数不能为空')
      }
    });
    // 手动一键填充----------------------------------------------------------

    // 全局变量----------------------------------------------------------
    let isRunning = false; // 控制启动的状态
    let timer = null // 定时器
    let list = [] // 商品列表
    let index = 1 //循环取商品变量
    const elementsToDisable = [
      '#daodiCheckbox', '#dizhiCheckbox', '#dizhiInput',
      '#riqiCheckbox',  '#fenleiInput', '#jiageInput'
    ];
    // 全局变量----------------------------------------------------------
    // 网页滚动到底部----------------------------------------------------------
    gundongdibuBtn.addEventListener('click', function () {
      // 切换状态
      isRunning = !isRunning;
      if (isRunning) {
        disabledElement();
        shoudongtianchongBtn.disabled = true;
        kaishizhuanfaBtn.disabled = true;
        gundongdibuBtn.textContent = '停止滚动到底';

        // 设置滚动逻辑
        timer = setInterval(() => {
          if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
            clearInterval(timer); // 到达底部时停止滚动
            isRunning = false; // 更新状态
            openElement();
            shoudongtianchongBtn.disabled = false;
            kaishizhuanfaBtn.disabled = false;
            gundongdibuBtn.textContent = '网页滚动底部'; // 恢复按钮文本
            alert("到底了");
            return;
          } else {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          }
          this.timer = timer;
        }, 5000); // 每6秒检查一次是否到底部
      } else {
        // 停止滚动：直接执行恢复操作（以防用户在没有到底部时点击停止）
        clearInterval(this.timer);
        openElement();
        shoudongtianchongBtn.disabled = false;
        kaishizhuanfaBtn.disabled = false;
        gundongdibuBtn.textContent = '网页滚动底部'; // 恢复按钮文本
      }
    });
    // 网页滚动到底部----------------------------------------------------------
    // 开始转发----------------------------------------------------------
    kaishizhuanfaBtn.addEventListener('click', function () {
      //获取到底转发
      let daodiOn = document.getElementById('daodiCheckbox').checked;
      //获取网页地址
      let dizhiOn = document.getElementById('dizhiCheckbox').checked;
      let dizhiInput = document.getElementById('dizhiInput');
      let dizhi = dizhiInput.value.trim();
      //获取分类设置
      let fenleiInput = document.getElementById('fenleiInput');
      let fenleishezhi = fenleiInput.value.trim();
      //获取价格倍数
      let jiageInput = document.getElementById('jiageInput');
      let jiagebeishu = parseFloat(jiageInput.value.trim());
      // 获取日期
      let riqiOn = document.getElementById('riqiCheckbox').checked;
      //如果分类设置与价格倍数不为空
      if (fenleishezhi !== '' && jiagebeishu !== '') {
        // 切换状态
        isRunning = !isRunning;
        //1.1判断运行状态
        if (isRunning) {
          disabledElement();
          shoudongtianchongBtn.disabled = true;
          gundongdibuBtn.disabled = true;
          kaishizhuanfaBtn.textContent = '停止转发'
          //传入index做为商品循环起始
          timer = setTimeout(() => {
            shangpinchuli(index, daodiOn, dizhiOn, dizhi, fenleishezhi, jiagebeishu, riqiOn);
          }, 1000)
        } else {
          // 如果正在执行,停止执行
          clearTimeout(timer);
          //运行状态改为停止
          isRunning = false;
          //按钮名称改为开始执行
          openElement();
          shoudongtianchongBtn.disabled = false;
          gundongdibuBtn.disabled = false;
          kaishizhuanfaBtn.textContent = '开始转发';
          return;
        }
      } else {
        return alert("分类和设置不能为空");
      }

    });
    // 开始转发----------------------------------------------------------

    // -------------------方法封装--------------------------------
    // js修改内容方法,inputDom为元素,newText为内容
    function changeReactInputValue(inputDom, newText) {
      let lastValue = inputDom.value
      inputDom.value = newText
      let event = new Event('input', { bubbles: true })
      event.simulated = true
      let tracker = inputDom._valueTracker
      if (tracker) {
        tracker.setValue(lastValue)
      }
      inputDom.dispatchEvent(event)
    }
    // js修改内容方法,inputDom为元素,newText为内容
    // 关闭元素
    function disabledElement() {
      elementsToDisable.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.disabled = true);
      });
    }
    // 关闭元素
    // 开启元素
    function openElement() {
      elementsToDisable.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.disabled = false);
      });
    }
    // 开启元素
    // 开始转发
    function shangpinchuli(index, daodiOn, dizhiOn, dizhi, fenleishezhi, jiagebeishu, riqiOn) {
      if (!isRunning) return;
      //判断是否到底
      if (daodiOn) {
        if (window.innerHeight + window.scrollY < document.body.offsetHeight - 10) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
          return timer = setTimeout(() => {
            shangpinchuli(index, daodiOn, dizhiOn, dizhi, fenleishezhi, jiagebeishu, riqiOn);
          }, 5000)
        }
      }
      //判断页面是否在店面
      if (dizhiOn) {
        let test = window.location.href;
        if (dizhi !== test) {
          // 如果正在执行,停止执行
          clearTimeout(timer);
          //运行状态改为停止
          isRunning = false;
          //按钮名称改为开始执行
          openElement();
          shoudongtianchongBtn.disabled = false;
          gundongdibuBtn.disabled = false;
          kaishizhuanfaBtn.textContent = '开始转发';
          return alert("地址变了");
        }
      }
      //判断日期是否还在
      if (riqiOn) {
        if (document.querySelector('.wgoo-tag__editor') === null) {
          // 如果正在执行,停止执行
          clearTimeout(timer);
          //运行状态改为停止
          isRunning = false;
          //按钮名称改为开始执行
          openElement();
          shoudongtianchongBtn.disabled = false;
          gundongdibuBtn.disabled = false;
          kaishizhuanfaBtn.textContent = '开始转发';
          return alert("日期变了");
        }
      }
      // 开始干活
      //所有商品放到list集合中
      list = document.querySelectorAll('a.f-flex.f-flex-wrap')
      //开始循环,传入index做为商品循环起始

      if (index > list.length) {
        // 如果正在执行,停止执行
        clearTimeout(timer);
        //运行状态改为停止
        isRunning = false;
        //按钮名称改为开始执行
        openElement();
        shoudongtianchongBtn.disabled = false;
        gundongdibuBtn.disabled = false;
        kaishizhuanfaBtn.textContent = '开始转发';
        return alert("执行完成");
      } else {
        timer = setTimeout(() => {
          //由后往前从集合中取出一个元素
          let one = list[list.length - index]
          //获得元素中的内容
          let price = one.querySelector(
            '.word-break.ellipsis-two.f14.g3'
          ).textContent
          //判断元素中是否包含💰
          if (!price.includes('💰')) {
            // 不包含💰,跳过当次循环,开始下一条
            index++
            return timer = setTimeout(() => {
              shangpinchuli(index, daodiOn, dizhiOn, dizhi, fenleishezhi, jiagebeishu, riqiOn)
            }, 1000)
          }
          //判断元素是否已添加
          if (one.querySelector('.ellipsis-one.warn-color.f10')) {
            // 已添加,跳过当次循环,开始下一条
            index++
            return timer = setTimeout(() => {
              shangpinchuli(index, daodiOn, dizhiOn, dizhi, fenleishezhi, jiagebeishu, riqiOn)
            }, 1000)
          }
          // 点击编辑按钮
          let editBtn = one.querySelector('.link.wsxc_edit.custom_bury')
          if (editBtn != null) {
            editBtn.click()
            // 等待编辑页面加载完成
            timer = setTimeout(function () {
              //获取分类设置
              let fenleiInput = document.getElementById('fenleiInput');
              let fenleishezhi = fenleiInput.value.trim();
              //获取价格倍数
              let jiageInput = document.getElementById('jiageInput');
              let jiagebeishu = parseFloat(jiageInput.value.trim());
              //如果分类设置与价格倍数不为空
              if (fenleishezhi !== '' && jiagebeishu !== '') {
                //获取分类按钮
                let fenleianniu = document.querySelector('.weui_cell_ft');
                //如果分类标签不为空，则点击
                if (fenleianniu != null) {
                  fenleianniu.click();
                  //分类页面加载等待2秒进行
                  setTimeout(() => {
                    //分类页面获取所有的分类标签
                    let fenleibiaoqian = document.querySelectorAll('.f12.word-break.g3');
                    if (fenleibiaoqian.length > 0) {
                      for (let item of fenleibiaoqian) {
                        //是否与分类设置一样
                        if (item.textContent.trim() === fenleishezhi) {
                          //如果是则点击,跳出循环
                          item.click();
                          //获取保存分类按钮
                          let wgooButtons = document.querySelectorAll('.wgoo-button');
                          if (wgooButtons != null) {
                            wgooButtons.forEach(button => {
                              let span = button.querySelector('.wgoo-button__content');
                              if (span && span.textContent.trim().includes('完成')) {
                                // 保存分类
                                button.click();
                              }
                            });
                          } else {
                            alert("未找到完成按钮")
                          }
                          //返回详情页等待2秒进行
                          setTimeout(() => {
                            // 获取详情描述框
                            let xiangqingkuang = document.querySelector('.weui_textarea')
                            //如果详情不等于空
                            if (xiangqingkuang != null) {
                              let xinjiage = 0
                              //获得价格框
                              let shoujiakuang = document.querySelector(
                                '.weui_input.text-right.error-color'
                              )
                              //获取详情内容
                              let jiuneirong = xiangqingkuang.value
                              //用正则表达式获取到带图标价格
                              let daichulijiage = jiuneirong.match(/(\d+)💰|💰(\d+)/)
                              if (daichulijiage != null) {
                                //获取纯价格
                                let yuanjiage = daichulijiage[1] || daichulijiage[2]
                                //新价格
                                xinjiage = yuanjiage * jiagebeishu
                                //把详情内容的价格进行替换得到新内容
                                jiuneirong = jiuneirong.replace(yuanjiage, xinjiage)
                              }
                              //用正则表达式匹配原市场
                              let daichulijiage2 = jiuneirong.match(
                                /原(价)?(本地)?(市场)?(💰)?(\d+)/
                              )
                              if (daichulijiage2 != null) {
                                //获取原市场
                                let yuanshichang = daichulijiage2[5]
                                //新市场
                                let xinshichang = yuanshichang * jiagebeishu
                                //把详情内容的价格进行替换得到新内容
                                jiuneirong = jiuneirong.replace(yuanshichang, xinshichang)
                              }
                              if (jiuneirong.includes('珂珂')) {
                                jiuneirong = jiuneirong.replace('珂珂', '雨墨');
                              }
                              //把新内容替换进详情描述框
                              changeReactInputValue(xiangqingkuang, jiuneirong)
                              //把新价格替换进售价输入框
                              if (shoujiakuang != null) {
                                changeReactInputValue(shoujiakuang, xinjiage)
                              }
                              // 点击保存按钮
                              let saveBtn = document.querySelector('div[data-bury-name="保存"]');
                              let primaryButton = saveBtn.querySelector('.wgoo-button__primary');
                              if (primaryButton != null) {
                                // 保存
                                primaryButton.click();
                                //等待5s开始执行
                                timer = setTimeout(() => {
                                  index++
                                  shangpinchuli(index, daodiOn, dizhiOn, dizhi, fenleishezhi, jiagebeishu, riqiOn)
                                }, 8000)
                              }
                            }
                          }, 3000); // 等待2秒
                        }
                      }
                    } else {
                      alert("未找到标签");
                    }
                  }, 3000); // 等待2秒
                } else {
                  alert("不在详情页");
                }
              } else {
                alert('分类和倍数不能为空')
              }
            }, 5000)
          }
        }, 5000)
      }
    }
    // 开始转发
    // -------------------方法封装--------------------------------
  };
})();
