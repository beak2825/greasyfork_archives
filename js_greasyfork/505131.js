// ==UserScript==
// @name         fordealfill
// @name:zh      自动填表
// @name:en      fordealfill
// @namespace    https://github.com/mixterjim
// @version      1.3
// @author       yy
// @description  自动填写表单数据的Tampermonkey脚本
// @description:en Tampermonkey Script for Autofilling Form Data
// @match        https://*.fordeal.com/zh-CN/goods/publish/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/505131/fordealfill.user.js
// @updateURL https://update.greasyfork.org/scripts/505131/fordealfill.meta.js
// ==/UserScript==

(function() {
    // 引入按钮组件样式
    const modalStyle = `
        /* 设置界面容器 */
        .settings-modal {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          zIndex: 9999;
          height:800px;
          width: 400px;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          position: fixed;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .settings-modal:hover {
          /* 鼠标悬停时的样式 */
          opacity: 1;
        }

        /* 标签样式 */
        .settings-label {
          font-weight: bold;
          margin-bottom: 10px;
          display: block;
        }

        /* 输入框样式 */
        .settings-textarea {
          width: 100%;
          padding: 8px;
          height:400px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
          color: #333;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .settings-pricearea {
          width: 100%;
          height:40px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
          color: #333;
          font-size:small;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

         .settings-zhongliangarea {
          width: 100%;
          height:40px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
          color: #333;
          font-size:small;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .settings-titletextarea {
          width: 100%;
          padding: 8px;
          height:90px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
          color: #333;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .settings-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        /* 按钮Div */
        .settings-buttons {
          display: flex;
        }

        /* 按钮样式 */
        .settings-button {
          flex: 1;
          padding: 8px 16px; /* 调整按钮的内边距 */
          margin-top: 10px;
          border: none;
          border-radius: 4px;
          color: #fff;
          background-color: #007bff;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 14px;  /* 调整按钮的字体大小 */
        }

        .settings-button:not(:last-child) {
          margin-right: 20px;
        }

        .settings-button:hover {
          background-color: #0056b3;
        }

        .settings-button:active {
          background-color: #004f9d;
        }

        /* 关闭按钮样式 */
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 6px;
          border: none;
          background-color: transparent;
          color: #333;
          font-size: 18px;
          cursor: pointer;
        }

        .close-button:hover {
          color: #007bff;
        }
    `;
    function trimNewlines(str) {
        return str.replace(/^[\r\n]+|[\r\n]+$/g, '');
    }

    // 创建设置按钮
    function createSettingsButton() {
        const button = document.createElement('button');
        button.innerText = 'fordealfill';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.opacity = 0.8;
        button.style.color = 'gray';
        button.style.textShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
        button.addEventListener('click', openSettingsModal);
        return button;
    }

    // 创建设置按钮
    function createSettingsButton2() {
        const button = document.createElement('button');
        button.innerText = '跳转跟卖页面';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.opacity = 0.8;
        button.style.color = 'gray';
        button.style.textShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
        button.addEventListener('click', opengengmaiModal);
        return button;
    }

    // 创建设置模态框
    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.style.zIndex = '9999'; // 解决部分网站会遮挡的问题

        const createElement = (tagName, className, text, eventListener) => {
            const element = document.createElement(tagName);
            if (className) element.className = className;
            if (text) element.innerText = text;
            if (eventListener) element.addEventListener('click', eventListener);
            return element;
        };

        const titleLable = createElement('label', 'settings-label', '标题：');
        const inputtitleField = createElement('textarea', 'settings-titletextarea');

        const priceLable = createElement('label', 'settings-label', '成本价：');
        const priceField = createElement('textarea', 'settings-pricearea');

        const zhongliangLable = createElement('label', 'settings-label', '重量：');
        const zhongliangField = createElement('textarea', 'settings-zhongliangarea');

        const inputLabel = createElement('label', 'settings-label', '款式图片链接/自动填充：');
        const closeButton = createElement('button', 'close-button', 'x', closeSettingsModal);
        const inputField1 = createElement('textarea', 'settings-textarea');
        const buttons = createElement('div', 'settings-buttons');
        const inputLabel2 = createElement('label', 'settings-label', '商品轮播图链接：');
        const inputField2 = createElement('textarea', 'settings-textarea');

        const saveButton = createElement('button', 'settings-button', '自动填充', saveFormData);
        const fillButton = createElement('button', 'settings-button', '恢复', fillForm);
        const clearButton = createElement('button', 'settings-button', '清空', clearFormData);

        modal.appendChild(titleLable);
        modal.appendChild(inputtitleField);
        modal.appendChild(priceLable);
        modal.appendChild(priceField);
        modal.appendChild(zhongliangLable);
        modal.appendChild(zhongliangField);

        modal.appendChild(inputLabel);
        modal.appendChild(closeButton);
        modal.appendChild(inputField1);
        modal.appendChild(inputLabel2);
        modal.appendChild(inputField2);

        modal.appendChild(buttons);
        buttons.appendChild(saveButton);
        //  buttons.appendChild(fillButton);
        // buttons.appendChild(clearButton);

        // 引入样式
        const styleElement = document.createElement('style');
        styleElement.textContent = modalStyle;
        document.head.appendChild(styleElement);

        return modal;
    }

    // 打开跟卖
    function opengengmaiModal() {
        window.location.href = window.location.href.replace("copyItemId","itemId").replace("copy","follow").replace("online","follow");


    }
    function delay(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    // 打开设置模态框
    function openSettingsModal() {
        const formData = getFormData();
        const modal = createSettingsModal();
        const inputField = modal.querySelector('textarea');

        inputField.value = "";

        // Check if the modal is already open
        if (!document.querySelector('.settings-modal')) {
            document.body.appendChild(modal);
            delay(300).then(function() {
                let inputField =document.querySelectorAll('.settings-modal textarea')[3];
                inputField.addEventListener('keyup', function(event) {
                    // 当用户释放键盘按键时，如果是修改了textarea的内容，这里的代码会被执行
                    if (event.target.value.indexOf("biaoti:") > -1) {
                        console.log('内容变化了:', event.target.value);
                        var allvalue = event.target.value;
                        var zhutu = "";
                        var skutu ="";
                        var title ="";
                        if (allvalue.indexOf("zhutu:") > -1) {
                            zhutu = allvalue.split("zhutu:")[1]
                            allvalue = allvalue.split("zhutu:")[0]
                            document.querySelectorAll('.settings-modal textarea')[4].value = trimNewlines(zhutu);
                        }
                        if (allvalue.indexOf("sku:") > -1) {
                            skutu = allvalue.split("sku:")[1]
                            allvalue = allvalue.split("sku:")[0]
                            document.querySelectorAll('.settings-modal textarea')[3].value = trimNewlines(skutu);

                        }
                        console.log("sfdgsdf:"+allvalue)
                        title = allvalue.split("biaoti:")[1]
                        document.querySelector('.settings-modal textarea').value = trimNewlines(title)




                    }
                });
            })

        }
    }

    // 关闭设置模态框
    function closeSettingsModal() {
        const modal = document.querySelector('.settings-modal');
        if (modal) {
            modal.remove();
        }
    }


    // 在需要延迟执行的地方调用delay函数
    //delay();

    // "kuangshidialog" 款式框弹出来
    // "kuangshijia" 款式加号
    // "kuanshifinish"
    // "daxiao" 大小
    var price = "";
    var weight = "";
    var zhuantai = "start";
    var ks = 2;
    var ksArr ="";
    var shanpingArr = "";
    var formData2 = "";

    function jisuanjiage(jinhuoprice) {
        var numberprice = Number(jinhuoprice);
        if (numberprice > 100) {
            return numberprice*1.93/6.8
        }
        if (numberprice > 80) {
            return numberprice*1.96/6.8;
        }
        if (numberprice > 50) {
            return numberprice*2.01/6.8;
        }
        if (numberprice > 30) {
            return numberprice*2.06/6.8;
        }
        if (numberprice < 8) {
            return numberprice*2.86/6.8;
        }
        return numberprice*2.48/6.8;
    }

    // 通用点按钮上传图片，并关闭窗口
    function shangchuangtupian() {
        setTimeout(function() {
            let textarea = document.querySelector('[rows="20"]');
            document.querySelector('[rows="20"]').value=formData2;
            console.log(shanpingArr);
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(function() {
                //确定按钮开始上传
                document.getElementsByClassName("el-button el-button--primary el-button--small")[document.getElementsByClassName("el-button el-button--primary el-button--small").length-1].click();
                //关闭窗口
                setTimeout(function() {
                    document.getElementsByClassName("el-dialog__close el-icon el-icon-close")[document.getElementsByClassName("el-dialog__close el-icon el-icon-close").length-1].click();

                    // X按钮
                    /*      document.getElementsByClassName("el-dialog__close el-icon el-icon-close")[document.getElementsByClassName("el-dialog__close el-icon el-icon-close").length-1].click();
                    delay(1000).then(function() {
                        // 确定按钮
                        document.getElementsByClassName("alert-main-footer border")[0].getElementsByClassName("el-button el-button--primary el-button--small")[0].click();
                    });*/

                },2000);

            },600)
        },400)
    }

    var zhuantaitupianfinishid = 0;
    // 等待款式图片传玩
    function waitingtupianfinish(i) {
        if (document.getElementsByClassName("delete")) {

            delay(100).then(function() {
                // 确定按钮
                document.getElementsByClassName("alert-main-footer border")[0].getElementsByClassName("el-button el-button--primary el-button--small")[0].click();
            });
            zhuantaitupianfinishid = i;
            if (i == ks) {
                console.log("kuanshifinish !!!");
                zhuantai = "kuanshifinish";

            }
            return;
        } else {
            delay(200).then(function () {
                console.log("等图片传玩xxxxx" +i);
                waitingtupianfinish();
            })
        }

    }

    // 等待上一个款式弄完
    function kuanshitupian1(i) {
        console.log("sdfdsfd" + zhuantai + i);
        if (document.getElementsByClassName("sku-item-img-dialog-body") && document.getElementsByClassName("sku-item-img-dialog-body").length > 0 && i > 1 && zhuantaitupianfinishid != i -1) {
            delay(500).then(function () {
                console.log("等上一个图片xxxxx" +i);
                kuanshitupian1(i);
            })
            return;
        }
        document.getElementsByClassName("add")[i-1].click();
        delay(100).then(function() {
            document.getElementsByClassName("upload-tit")[1].click();
        })
        setTimeout(function() {
            let textarea = document.querySelector('[rows="20"]');
            document.querySelector('[rows="20"]').value=ksArr[i-1];
            textarea.dispatchEvent(new Event('input', { bubbles: true }));

        },500)
        setTimeout(function() {
            //确定按钮开始上传
            document.getElementsByClassName("el-button el-button--primary el-button--small")[document.getElementsByClassName("el-button el-button--primary el-button--small").length-1].click();
            //关闭窗口
            setTimeout(function() {
                // X按钮
                document.getElementsByClassName("el-dialog__close el-icon el-icon-close")[document.getElementsByClassName("el-dialog__close el-icon el-icon-close").length-1].click();
                delay(1000).then(function() {
                    // 确定按钮
                    waitingtupianfinish(i);
                });

            },2200);

        },600)

    }

    // 上传款式图片
    function kuanshitupian() {
        //上传图片
        if (zhuantai == "kuangshijia") {
            console.log("kuanshitupian");
        } else {
            delay(400).then(function() {
                kuanshitupian();
            })
            return;
        }
        for (let i = 1; i <= ks; i++) {
            setTimeout(function() {
                kuanshitupian1(i)
            }, (i) * 1000);
        }
    }


    // 款式选择
    function kuanshixuanzhe() {
        if (zhuantai == "kuangshidialog" || zhuantai == "kuangshijia") {
            console.log("dddd");
            return;
        } else {
            delay(300).then(function() {
                kuanshixuanzhe();
            })
        }

        if (document.querySelector('[alt=款式1]')) {
            zhuantai="kuangshidialog";
            console.log("kuangshidialog show");
            for (let i = 1; i <= ks; i++) {
                setTimeout(function() {
                    let name = "款式"+i;
                    document.querySelector('[alt='+name+']').click();

                    console.log(name);
                    if (i == ks) {
                        setTimeout(function() {
                            //确定按钮
                            document.getElementsByClassName("el-button el-button--primary el-button--small")[2].click();
                            zhuantai = "kuangshijia";
                        }, 300);
                    }
                }, i * 150);
            }
        }
    }
    // 款式
    function kuangshi() {
        // 添加款式按钮
        document.getElementsByClassName("el-button el-button--primary el-button--small")[0].click();
        // 款式框是否显示完成
        delay(300).then(function() {
            kuanshixuanzhe();
        })

        // 上传图片
        delay(400).then(function() {
            kuanshitupian()
        })

    }

    // 价格和重量
    function jiagezhongliang() {
        if (zhuantai !== "kuanshifinish") {
            console.log("等待款式弄完");
            delay(1000).then(function() {
                jiagezhongliang();
            })
            return;
        }
        // 价格
        var jiageelement =  document.getElementsByClassName("el-form-item__content")[2].getElementsByClassName("el-input__inner")[0];
        jiageelement.value=jisuanjiage(price);
        let inputevent = new InputEvent('input', {
            'bubbles': true,
            'cancelable': false
        })
        jiageelement.dispatchEvent(inputevent)
        let changeEvent = new Event('change', {
            'bubbles': true
        })
        jiageelement.dispatchEvent(changeEvent)

        // 库存
        var kucunelement = document.getElementsByClassName("el-form-item__content")[3].getElementsByClassName("el-input__inner")[0];
        kucunelement.value="1111";
        kucunelement.dispatchEvent(inputevent)
        kucunelement.dispatchEvent(changeEvent)

        // 重量
        var zhongliangelement = document.getElementsByClassName("el-form-item__content")[4].getElementsByClassName("el-input__inner")[0];
        zhongliangelement.value = weight;
        zhongliangelement.dispatchEvent(inputevent)
        zhongliangelement.dispatchEvent(changeEvent)

        delay(200).then(function() {
            document.getElementsByClassName("mod-batch-action")[0].getElementsByClassName("el-button el-button--primary el-button--small")[0].click();
        })
    }


    //商品轮播图
    function shangpinlunbotu() {
        if (zhuantai !== "kuanshifinish") {
            console.log("等待款式弄完");
            delay(900).then(function() {
                shangpinlunbotu();
            })
            return;
        }
        console.log("shangpinglunbotu");

        document.getElementsByClassName("main-content")[0].scrollTo({  top: 5*document.body.scrollHeight,
                                                                     behavior: 'smooth'
                                                                    });
        //商品详情图 begin
        delay(1000).then(function() {
            let letold = document.querySelectorAll('[class=delete]');
            let oldsize = letold.length;
            let xx =1;
            console.log("sdfsdfdelete"+oldsize);

            for ( xx; xx<=oldsize;xx++) {
                console.log("delete"+xx);
                setTimeout(function() {
                    document.querySelectorAll('[class=delete]')[0].click();
                }, xx*100)

            };

            delay(400+xx*90).then(function() {
                document.getElementsByClassName("com-upload__content")[1].getElementsByClassName("upload-tit")[1].click();
                setTimeout(function() {
                    shangchuangtupian();
                },1000)});
        });
    }



    // 保存表单数据到本地存储
    function saveFormData() {
        // 滑动到底部

        delay(100).then(function() {
            const modal = document.querySelector('.settings-modal');
            if (modal) {
                modal.remove();
            }
        });

        var title = document.querySelector('.settings-modal textarea').value.split(/[(\r\n)\r\n]+/);
        console.log(title);

        price =document.querySelectorAll('.settings-modal textarea')[1].value;
        weight = document.querySelectorAll('.settings-modal textarea')[2].value;

        console.log("price:"+price)
        console.log("weight:"+weight)
        var inputField = document.querySelectorAll('.settings-modal textarea')[3];
        var formData = inputField.value;
        ksArr = formData.split(/[(\r\n)\r\n]+/);

        console.log(ksArr);
        ks = ksArr.length;
        if (formData == '')
            ks = 0
        formData2 = document.querySelectorAll('.settings-modal textarea')[4].value;
        shanpingArr=formData2.split(/[(\r\n)\r\n]+/);


        //输入文案
        let pdf = document.getElementsByClassName("el-textarea__inner")[0];
        pdf.value=title[0];
        pdf.dispatchEvent(new Event('input', { bubbles: true }));

        delay(1000).then(function() {
            let pdf = document.getElementsByClassName("el-input__inner")[1];
            //       pdf.value="自有品牌";
            pdf.dispatchEvent(new Event('input', { bubbles: true }));
            let event = new MouseEvent('click', {
                'bubbles': true,
                'cancelable': false
            });

            // 触发点击
            pdf.dispatchEvent(event);
            delay(600).then(function() {
                let pdfxx = document.getElementsByClassName("el-select-dropdown__item")
                let lenxx = pdfxx.length;
                let event = new MouseEvent('click', {
                    'bubbles': true,
                    'cancelable': false
                });
                pdfxx[lenxx-1].dispatchEvent(event);
            })
        })


        delay(1400).then(function() {
            document.getElementsByClassName("main-content")[0].scrollTo({  top: 2*document.body.scrollHeight,
                                                                         behavior: 'smooth'
                                                                        });
        })



        //   document.getElementsByClassName("main-content")[0].scrollTop=10000;

        //    document.getElementsByClassName("el-input__inner")[1].value='自有品牌';

        // ----------------- 商品规格 begin--------------------------
        // 先吧以前的删了
        if (ks > 0) {
            delay(2000).then(function(){

                let letold = document.querySelectorAll('[class=el-icon-error]');
                let oldsize = letold.length;
                let xx =1;
                for ( xx; xx<=oldsize-1;xx++) {
                    console.log("dddd");
                    setTimeout(function() {
                        document.querySelectorAll('[class=el-icon-error]')[0].click();
                    }, xx*100)

                };


                delay(oldsize*300).then(function() {
                    kuangshi();
                }) ;

                if (price != "" && weight != "") {
                    delay(1000).then(function() {
                        jiagezhongliang();

                    })
                }
            });
        }

        //商品详情图 end
        if (shanpingArr.length > 0 && formData2 != '') {
            delay(3000+ks*3100).then(function() {
                shangpinlunbotu();
            })
        }

        // 保存表单数据到本地存储
        //   localStorage.setItem('formData', formData);
        //  console.log(formData);
        // closeSettingsModal();
    }

    // 清空表单数据
    function clearFormData() {
        // 清空本地存储中的表单数据
        localStorage.removeItem('formData');

        // 清空表单中的值
        const formFields = document.querySelectorAll('input, textarea, select');
        formFields.forEach(function(field) {
            field.value = '';
        });

        closeSettingsModal();
    }

    // 获取表单数据
    function getFormData() {
        const formFields = document.querySelectorAll('input, textarea, select');
        const formData = {};
        const form = document.querySelector('form');

        formFields.forEach(function(field) {
            formData[field.name] = field.value;
        });

        return JSON.stringify(formData);
    }

    // 设置表单数据
    function setFormData(formData) {
        try {
            const parsedData = JSON.parse(formData);
            const formFields = document.querySelectorAll('input, textarea, select');

            formFields.forEach(function(field) {
                if (field.name in parsedData) {
                    field.value = parsedData[field.name];
                }
            });
        } catch (error) {
            console.error('无法解析表单数据:', error);
        }
    }

    // 自动填充表单数据
    function fillForm() {
        // 检查本地存储中是否存在已保存的表单数据
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            setFormData(savedFormData);
        }
        closeSettingsModal();
    }

    // 在页面完全加载后执行
    window.addEventListener('load', function() {
        // 添加设置按钮
        const settingsButton = createSettingsButton();
        const settingsButton2 = createSettingsButton2();

        document.body.appendChild(settingsButton);
        document.body.appendChild(settingsButton2);

        setTimeout(openSettingsModal,2000);
        // 自动填充表单数据
        setTimeout(fillForm, 1000); // 延迟填充数据，防止表单未完全载入
    });
})();