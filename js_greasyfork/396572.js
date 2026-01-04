// ==UserScript==
// @name         Tock
// @namespace    http://www.womow.cn/
// @version      0.1.2
// @description  流程
// @author       Song
// @match        *://www.toctalk.com.cn/iweb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396572/Tock.user.js
// @updateURL https://update.greasyfork.org/scripts/396572/Tock.meta.js
// ==/UserScript==


(function () {
    //region 首页
    /**
     *
     */
  function createLink() {
        let link = $('<div class="toc-minor-function-item tfl-left" title="防疫日报"><img src="/iweb/res_toc/images/index/approve.png"><p style="color: orangered">防疫日报</p></div>');
        $('.toc-minor-function').css('width', '226px').append(link);
        link.on('click', () => {
            window.open('/iweb/mine/form/bpm/toFormView?formid=a66f39a621414b249657886259044a1c');
        })
    }

    //endregion

    //region  审批表单

    const ID_PREFIX = 'form-field-';
    // 默认的表单域ID
    const DEFAULT_FIELD_IDS = ['csrFormItemHide', 'xzclSt'];
    const EXCLUDE_IDS = [];
    EXCLUDE_IDS.sort();

    let storage = {

        store: function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        restore: function (key) {
            let text = localStorage.getItem(key);
            if (typeof text === 'undefined' || text == null) {
                return null;
            }
            return JSON.parse(text);
        }
    };

    let formHandlers = [];

    formHandlers.push({
        id: '1581766834136X14',
        type: 'RESTORE',
        handler: function (key, value, data) {
            let oldDate = data['1581766535663X8'];
            let today = JSON.stringify(new Date()).substring(1, 11);
            if (today > oldDate) {
                data[key] = data['1581766967631X16'];
            }
        }
    });

    /*填报日期*/
    formHandlers.push({
        id: '1581766535663X8',
        type: 'RESTORE',
        handler: function (key, value, data) {
            data[key] = JSON.stringify(new Date()).substring(1, 11);
        }
    });


    /**
     * 对数据执行Handler
     * @param data
     * @param type
     */
    function applyFormHandlers(data, type = 'RESTORE') {
        for (let i = 0; i < formHandlers.length; i++) {
            const item = formHandlers[i];
            item.handler(item.id, data[item.id], data);
        }
    }

    /**
     * 保存表单
     */
    function storeForm() {
        let formItems = $('#formView .form-item');
        let data = {};
        formItems.each(function (i) {
            let f = $(this).find(':input');
            if (f.length === 0) {
                console.info('无表单域', f.length, $(this).attr('id'));
                return;
            }
            let key = f.attr('id').replace(ID_PREFIX, '');
            if (EXCLUDE_IDS.indexOf(key) < 0) {
                data[key] = f.val();
            }
        });

        for (let i = 0; i < DEFAULT_FIELD_IDS.length; i++) {
            const id = DEFAULT_FIELD_IDS[i];
            let f = document.getElementById(id);
            data[id] = f.value;
        }

        applyFormHandlers(data, 'STORE');
        storage.store('form-data', data);
    }

    function restoreForm() {
        let data = storage.restore('form-data');
        if (!data) return;
        applyFormHandlers(data, 'RESTORE');
        for (let key in data) {
            let id = DEFAULT_FIELD_IDS.indexOf(key) < 0 ? `${ID_PREFIX}${key}` : key;
            let field = document.getElementById(id);
            if (field === null) {
                console.warn(`${ID_PREFIX}${key}对应的Filed 不存在`);
            } else {
                field.value = data[key];
            }
        }
    }

    function submitForm() {
        storeForm();
        iWeb_formBpmEdit.saveForm();
    }


    function createButtons() {
        // top.Toc || top.Toc = window.Toc
        let div = $('<div style="width: 20px; float: right; position:relative; right: 160px; "></div>');
        let storeBtn = $('<button  style="margin: 2px 0;">存储</button>');
        let restoreBtn = $('<button  style="margin: 2px 0;">恢复</button>');
        let submitBtn = $('<button  style="margin: 2px 0;">提交</button>');
        restoreBtn.on('click', restoreForm);
        storeBtn.on('click', storeForm);
        submitBtn.on('click', submitForm);
        if (storage.restore('_toc-env') == true) {
            div.append(storeBtn);
        }
        div.append(restoreBtn).append(submitBtn);

        $('#formInfoDiv').after(div);

        setTimeout(restoreForm, 1000);
        if (top === this) {
            top.Toc.loading = {
                showLoading() {
                },
                hideLoading() {
                }
            };

            Toc.utils.toastrMsg = function (a, b, c) {
                alert(b)
            }
        }

        top.iWeb_formBpmList_A = {
            emptyViewInfo() {
            }
        };
        top.iWeb_formBpmList_B = {
            loadList() {
            }
        };

    }

    //endregion

    /**
     * 初始化方法
     */
    function init() {
        let pathname = window.location.pathname;
        if (pathname.indexOf('web/iweb/index') > 0) {
            createLink();
        } else if (pathname.indexOf('iweb/mine/form/bpm/toFormView')) {
            createButtons();
        }
    }

    console.info('=========tock bird=========')
    init();
})();
