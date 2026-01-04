// ==UserScript==
// @name        Breed Bootloader Translation
// @description Перевод загрузчики Breed
// @author      LESHIY_ODESSA
// @icon            http://www.mi.com/favicon.ico
// @icon64        http://www.mi.com/favicon.ico
// @include	    *192.168.178.44/*
// @include	    *10.1.2.1/*
// @include	    *Bootloader_Breed_www*
// @version     1.0
// @namespace
// @namespace https://greasyfork.org/users/249198
// @downloadURL https://update.greasyfork.org/scripts/378129/Breed%20Bootloader%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/378129/Breed%20Bootloader%20Translation.meta.js
// ==/UserScript==
//
// !!!!!!!!!!!!!!!! @include     file://*
// English Translator
// https://github.com/szsoftware/breed-translator/blob/master/src/main.js

(function () {

    function findAndReplace(searchText, replacement, searchNode) {
        if (!searchText || typeof replacement === 'undefined') {
            // Throw error here if you want...
            return;
        }
        var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText,
            childNodes = (searchNode || document.body).childNodes,
            cnLength = childNodes.length;
	    excludes = 'html,head,style,title,link,meta,script,object,iframe';
        while (cnLength--) {
            var currentNode = childNodes[cnLength];
            if (currentNode.nodeType === 1 && (',' + excludes + ',').indexOf(',' + currentNode.nodeName.toLowerCase() + ',') === -1) {
                arguments.callee(searchText, replacement, currentNode);
            }
            if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
                continue;
            }
            var parent = currentNode.parentNode,
                frag = (function(){
                    var html = currentNode.data.replace(regex, replacement),
                        wrap = document.createElement('div'),
                        frag = document.createDocumentFragment();
                    wrap.innerHTML = html;
                    while (wrap.firstChild) {
                        frag.appendChild(wrap.firstChild);
                    }
                    return frag;
                })();
            parent.insertBefore(frag, currentNode);
            parent.removeChild(currentNode);
        }
    }

    function translate() {
        var ts = {
//Дополнительные настройки - Прочее
		"关于":"О Breed",
		"更新：":"Обновление: ",
		"本产品仅供个人免费使用, 禁止用于商业目的":"Этот продукт предназначен только для личного использования, запрещен для коммерческих целей.",
		"更新完成，设备正在重启。本页面不会刷新，请手动检查设备状态。":"Обновление завершено и устройство перезагружается. Эта страница не будет обновлена. Проверьте состояние устройства вручную.",
		"正在更新固件，请耐心等待至进度条完成":"Обновляя прошивку, будьте терпеливы, пока индикатор выполнения не завершится",
		"请选择正确的固件类型，错误选择可能损坏固件。":"Выберите правильный тип прошивки. Неправильный выбор может повредить прошивку.",
		"同一时间只允许有一个备份任务":"Одновременно допускается только одна задача резервного копирования",
		"单击按钮备份相应的数据":"Нажмите кнопку, чтобы создать резервную копию соответствующих данных.",
		"小米路由器 3G Firmware 1":"Xiaomi Router 3G Firmware 1",
		"小米路由器 3G Firmware 2":"Xiaomi Router 3G Firmware 2",
		"小米路由器 3G 固件 1":"Xiaomi Router 3G Firmware 1",
		"小米路由器 3G 固件 2":"Xiaomi Router 3G Firmware 2",
		"小米路由器 3G 原厂固件":"Оригинальная Xiaomi Router 3G",
		"单击":"Нажмите кнопку",
		"恢复出厂设置。":"cбросить до заводских настроек.",
		"恢复出厂设置":"Сбросить до заводских настроек",
		"按钮以":"чтобы ",
		"重启路由":"перегрузить роутер.",
		"常规固件":"Обычная прошивка",
		"MAC 地址修改":"Изменить MAC адреса",
		"小米 R3G Bdata":"Xiaomi R3G Bdata",
		"环境变量编辑":"Edit PATH",
		"小米 R3G 设置":"Настройки Xiaomi R3G",
		"固件备份":"Резервное копирование ПО",
		"固件更新":"Обновление прошивки",
		"系统信息":"Информация о системе",
		"自动重启":"Автоматическая перезагрузка",
		"闪存布局":"Flash разметка",
		"编程器固件":"Full ROM image",
		"内存":"RAM",
		"文件已上传":"Файл загружен",
		"以太网":"Ethernet",
		"时钟频率":"Частота",
		"编译日期":"Дата компиляции",
		"版本":"Версия",
		"无法判断固件类型":"Невозможно определить тип прошивки",
		"固件类型":"Тип прошивки",
		"字段":"Поле",
		"值":"Значение",
		"添加":"Добавить",
		"保存":"Сохранить",
		"删除":"Удалить",
		"自动Restart":"Автоматический Restart",
    "保留现有 Bootloader":"Сохранить существующий Bootloader",
		"保留现有 EEPROM":"Сохранить существующий EEPROM",
		"提示":"Подсказка",
		"返回":"Назад",
		"重启":"Restart",
		"上传":"Поехали!",
		"执行":"Выполнить",
		"独立参数":"независимый параметр",
		"路由正在Restart":"Перезагрузка роутера",
		"请耐心等待。":" подождите пожалуйста.",
		" 以":", чтобы ",
		"本页面不会自动刷新, 请自行检查是否Restart成功。":"Эта страница не будет автоматически обновляться, проверьте самостоятельно осуществился ли перезапуск.",
		"恢复控制台":"— Консоль восстановления",
		"单击":"Нажмите кнопку",
		"更新确认":"Подтвердите обновление",
		"请确认下方列出的信息":"пожалуйста, подтвердите информацию, указанную ниже.",
		"类型":"Тип",
		"文件名":"Имя файла",
		"大小":"Размер",
		"MD5 校验":"MD5 сумма",
		"更新":"Поехали!",
		"正在校验 固件 数据":"Проверка",
		"您选择的操作正在进行":"Выполняется операция, которую вы выбрали.",
		"操作正在进行":"Операция выполняется",
		"正在写入 固件":"Запись",
		"正在校验 固件 擦除块":"Стирание",
		"警告: 在操作进行过程中请不要断开电源":"ПРЕДУПРЕЖДЕНИЕ. Не отключайте питание во время работы.",
		"错误":"Ошибка",
		"固件":"Firmware",
		"修订号":"Версия",
		"联系作者: hackpascal@gmail.com":"Связаться с автором: hackpascal@gmail.com",
        "修改": "Изменить",
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
		"：":": ",
		"，":", ",
		"；":"; ",

		};
        for(var t in ts) {
            findAndReplace(t,ts[t]);
        }
        setTimeout(translate, 500);
    }

    setTimeout(translate, 500);

})();