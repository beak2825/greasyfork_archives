// ==UserScript==
// @name        engage_for_retail
// @namespace   virtonomica
// @description    На странице управления персоналом
// @description    позволяет нанять персонал в магазины с учетом потребностей
// @version     1.02
// @author      chippa
// @include     http*://virtonomic*.*/*/main/company/view/*/unit_list/employee
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/422144/engage_for_retail.user.js
// @updateURL https://update.greasyfork.org/scripts/422144/engage_for_retail.meta.js
// ==/UserScript==
var run = function ()
{
    function wall(title, total) {
        total = typeof (total) != 'undefined' ? '/' + total : 'анализ';
        $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
        $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено ' + title + ': <span id="js-curr"></span>' + total + '</div>').width($(window).width()).prependTo('body');
    } // end of wall()

    function remove_wall() {
        $('#js-progress').remove();
        $('#js-wall').remove();
    } //end of remove_wall()

    function doit(arr, action, title, process) {
        try {
            wall(title, arr.length);
            promise = $.when();
            $.each(arr, function (index, obj) {
                promise = promise.then(function () {
                    $('#js-curr').text(index);
                    process(obj, action);
                    return;
                });
            });
            remove_wall();
            return;
        } catch (ex) {
            alert(ex);
        }
    } //end of doit()

    function engage(ref, action) {
        if (action == '') {action = 1;}
        var url=/(\/\w+)/.exec(location.pathname)[0] + '/window/unit/view/' + ref;
        $.ajax({
            type: 'GET',
            //url: /^http:\/\/virtonomic[as]\.(\w+)\/(\w+)\//.exec(location.href) [0] + 'window/unit/view/' + ref,
            url:url,
            async: false,
            success: function (data) {
                var need = $('span:contains("требуется ~")', data).parent().text().replace(/\s/g, '').match(/\d+/g) [1];
                var href = /(\/\w+)/.exec(location.pathname)[0] + '/window/unit/employees/engage/' + ref;
                $.ajax({
                    type: 'GET',
                    url: href,
                    async: false,
                    success: function (data) {
                        console.log(ref+" -> "+parseInt(need * action));
                        $.ajax({
                            type: 'POST',
                            async: false,
                            url: href,
                            data: {'unitEmployeesData[quantity]' : parseInt(need * action), 'unitEmployeesData[salary]' : $('#salary', data).val()}
                        });
                    }
                });
            }
        });
    } //end of engage

    function engageAll(action) {
        var arr = [];
        arr.length = 0;
        $('table.list>tbody>tr>th:eq(0)>input').attr('checked', false); //uncheck group flag
        $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function () {
            $(this).attr('checked', false); //uncheck
            var ref = $(this).parent().parent().find('.u-c.i-shop a').attr('href').match(/\d+/g);
            if (ref == '') {
                console.log('not shop');
                return;
            }
            arr[arr.length] = ref;
        });
        doit(arr, action, ' (наем сотрудников)', function (ref, action) {
            engage(ref, action);
        });
        //location.reload(); //если надо перегружать страницу
    } //end of engageAll()

    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    //кнопка
    var tstyle = $('form[name="unitsEmployee"] tbody:eq(0) fieldset');
    tstyle[0].id = "id_unitsEmployee";
    document.getElementById('id_unitsEmployee').style.height="110px";
    var pos = $(tstyle[0]).find('input[name="engage"]').parent().parent().after($('<tr>')).next();
    pos.append($('<td><input class="button130" type="button" value="Нанять в маг" name="engage_for_shop" id="engage_for_shop"><td>Нанять сотрудников в магазин с коэф <input type="text" border="0" id="engage_action" name="engage_action" size="5" value="1.00"></td>'));
    $('#engage_for_shop').click(function () {engageAll(parseFloat($('#engage_action').val().match(/\d+.\d+/)));});
};
var script = document.createElement('script');
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);