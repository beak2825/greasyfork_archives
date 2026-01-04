// ==UserScript==
// @name        Virtonomica:equipment
// @namespace   Virtonomica
// @description Ремнот в групповом управлении
// @include     https://virtonomica.ru/*/main/company/view/*/unit_list/equipment
// @include     https://virtonomica.ru/*/main/company/view/*/unit_list/equipment?old
// @version     0.03
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/34558/Virtonomica%3Aequipment.user.js
// @updateURL https://update.greasyfork.org/scripts/34558/Virtonomica%3Aequipment.meta.js
// ==/UserScript==
var run = function()
{

    // Стили
    var st = $("style");
    st.append(".my_rem_btn{cursor:pointer;opacity:0.5;max-width: 60px;padding: 4px;text-align: center;border: solid 1px;border-radius: 8px;background-color: #ecd1ae;margin-left: 4px;}");
    st.append(".my_rem_btn:hover{opacity:1.0;background-color: #bbd3ea;}");
    st.append(".my_flex{display:flex;}");
    st.append(".eq_inp{border-radius: 8px;border: solid 1px;text-align: center;}");
    st.append("#my_info{font-weight: normal;padding-top: 4px;padding-left: 8px;color: goldenrod;}}");
    //st.append(".selected{background-color: khaki;}");


    var wc_inp = $("<input id=eq_limit value='1' size='2' class=eq_inp title='При каком количестве неисправного оборудования надо отмечать подразделение для ремонта'>");
    var wc = $("<div class=my_rem_btn>mark</div>");
    var wc_info = $("<div id=my_info></div>");

    $("legend:eq(1)").append("<div class=my_flex id=eq_cnt>");
    $("#eq_cnt").append(wc_inp).append( wc).append( wc_info );

    /**
     * Проверить наличие тега
     * @param tag_name
     */
    function check_tag( unit_name, tag_name ) {
        var nsymbol = unit_name.indexOf( tag_name );
        if ( nsymbol > 0 ) return true;
        return false;
    }

    wc.click(function (){
        var list_tr = $("a[href*='unit/equipment']");
        $("#my_info").html('');
        var count_row = 0;
        for(var i=0; i< list_tr.length; i++){
            var tr = list_tr.eq(i).parent().parent();
            //tr.removeClass('selected');
            var td = $("input[name='wear']", tr).parent();
            //console.log( td.text());
            str = td.text();
            str = str.replace("+1","");
            // http://regexpres.narod.ru/calculator.html?regExp=%5C(%5B0-9%5D%7B1%2C%7D%5C)&replaceInputDisabled=true&inputText=16.2%25%20(345)&exec=true
            var VRegExp = new RegExp(/\([0-9]{1,}\)/);
            var VResult = VRegExp.exec( str );

            var equip = parseInt( VResult[0].replace("(","").replace(")","") );

            //console.log( equip );

            var unit_name = $("a[href*='main/unit/view']", tr).parent().text();

            var rem99 = check_tag(unit_name, '#rem99%');
            var ef = 100;
            if ( rem99 ) {
                ef = parseFloat( $("td", tr).eq(8).text().replace('%','') );
                //console.log(ef);
            }
            // при наличии тега "#rem99%" ремонтируем тогда, когда эффективность ниже 100%
            if ( rem99 && ef == 100 ) continue;

            if ( equip < $("#eq_limit").val() ) {
                // при наличии тега "#rem99%" ремонтируем тогда, когда эффективность ниже 100%
                if ( !rem99 ) continue;
            }

            // не отмечать подразделения, помеченные тегом #norem
            if ( check_tag( unit_name, '#norem') ) continue;

            count_row++;
            $( "input", $("td", tr).eq(0)).click();
            //tr.addClass('selected');

        }
        $("#my_info").html('помечено подразделений: ' + count_row + ' из ' + list_tr.length );
    });
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}