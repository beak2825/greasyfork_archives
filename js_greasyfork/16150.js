// ==UserScript==
// @name        Extraction stocks
// @namespace           DreadCast
// @include             http://www.dreadcast.net/Main
// @author                      Ianouf
// @date                        10/01/2016
// @version             0.3
// @description         Export des stocks au format TSV ou CSV
// @grant               none
// @compat                      Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/16150/Extraction%20stocks.user.js
// @updateURL https://update.greasyfork.org/scripts/16150/Extraction%20stocks.meta.js
// ==/UserScript==
 
var exportStockType = 1;
 
Engine.prototype.openDataBoxSave = Engine.prototype.openDataBox;
Engine.prototype.openDataBox = function(call, controller, toEval, idController){
        $.ajaxSetup({async: false});   
        var res = this.openDataBoxSave(call, controller, toEval, idController);
        console.log('called');
        if(isExportStockCallable(call)){
                console.log('activee');
                $('#modif_stocks_form').append('<input type="checkbox" id="exportStockToCSV"><div id="exportStock"></div>');
                $('#exportStock').css({
                        position: 'absolute',
                        right: '18px',
                        top: '21px',
                        width: '37px',
                        height: '36px',
                        background: 'url(../../../images/fr/design/boutons/boutons.png) -228px -382px no-repeat'
                }).hover(function(){
                        $(this).css({'background-position': '-263px -382px'});
                }, function(){
                        $(this).css({'background-position': '-228px -382px'});
                }).click(function(){
                        exportStocks();
                });
                $('#exportStockToCSV').css({
                        position: 'absolute',
                        right: '54px',
                        top: '21px',
                        width: '37px',
                        height: '36px'
                });
        }
        $.ajaxSetup({async: true});
        return res;
}
 
function exportStocks(){
        var separateur = "\t";
        if($('#exportStockToCSV').is(':checked')){
                separateur = ";";
        }
        var exportContent = 'nom'+separateur+'image'+separateur+'quantiteDispo';
        if(exportStockType == 1){
                exportContent += separateur+'prixProd';
        }
        exportContent += separateur+'quantiteVente'+separateur+'prixVente'+"\n";
       
        $('#liste_stocks .sp').find('div.stock').each(function(){
                var ligne = $(this).find('.nom_item .couleur4').html();
                ligne+=separateur;
                ligne += $(this).find('.case_item.linkBox').find('img').eq(0).attr('src').replace('http://www.dreadcast.net/images/objets/', '');
                ligne+=separateur;
                ligne += $(this).find('.quantite_vente.type2').eq(0).html().trim();
                ligne+=separateur;
               
                if(exportStockType == 1){
                        ligne += $(this).find('.prix.type2').eq(0).html().replace(' ', '').replace('Cr', '').trim();
                        ligne+=separateur;
                        ligne += $(this).find('.quantite2.type2').eq(0).find('input').eq(0).val().trim();
                        ligne+=separateur;
                        ligne += $(this).find('.prix2.type2').eq(0).find('input').eq(0).val().trim();
                }else{
                        ligne += $(this).find('.quantite2.type2').eq(0).html().trim();
                        ligne+=separateur;
                        ligne += $(this).find('.prix.type2').eq(0).find('input').eq(0).val().trim();
                }
               
                exportContent += ligne+"\n";
        });
        var exportTextArea = $('#exportTextArea');
        if(!exportTextArea.length){
                $('#modif_stocks_form').append('<textarea id="exportTextArea"></textarea>');
                exportTextArea = $('#exportTextArea').css({
                        position: 'absolute',
                        left: '18px',
                        top: '21px',
                        width: '408px',
                        height: '36px'
                });
        }
        exportTextArea.val(exportContent).focus().select();
 
}
 
function isExportStockCallable(z){
        var y = $('#lieu_actuel .titre2').eq(0).html();
    var a = z == 'Company/Stocks/Display';
        var b = y == '66 Rue du Deanétique';
        var c = y == '56 Rue du Deanétique';
        var d = y == '70 Rue Amstrade';
        var e = y == '50 Rue du Deanétique';
        if(c || d) exportStockType = 2;
        return (a &&  (b || c || d || e));
}
 
console.log('export stocks');