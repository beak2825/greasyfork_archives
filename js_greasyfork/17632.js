// ==UserScript==
// @name          топменеджер
// @namespace    топменеджер
// @version 	   3
// @description   топменеджер1
// @include       http*://virtonomic*.*/*/main/user/privat/persondata/knowledge

// @downloadURL https://update.greasyfork.org/scripts/17632/%D1%82%D0%BE%D0%BF%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/17632/%D1%82%D0%BE%D0%BF%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80.meta.js
// ==/UserScript==

var run = function(){
//  $('tr.qual_item > td > div.graph > div.text').each(function() {
   $('tr.qual_item').each(function() {
     var maxprir={1:1,2:0.674,3:0.535,4:0.454,5:0.4,6:0.36,7:0.33,8:0.306,9:0.286,10:0.269,11:0.255,12:0.243,13:0.232,14:0.222,15:0.214,16:0.206,17:0.199,18:0.193,19:0.187,20:0.181,21:0.176,22:0.172,23:0.167,24:0.163,25:0.16,26:0.156,27:0.153,28:0.15,29:0.147,30:0.144,31:0.141,32:0.139,33:0.136,34:0.134,35:0.132,36:0.13,37:0.128,38:0.126,39:0.124,40:0.122,41:0.12,42:0.119,43:0.117,44:0.116,45:0.114,46:0.113,47:0.111,48:0.11,49:0.109,50:0.108,51:0.106,52:0.105,53:0.104,54:0.103,55:0.102,56:0.101,57:0.1,58:0.099,59:0.098,60:0.097,61:0.096,62:0.095,63:0.094,64:0.093,65:0.093,66:0.092,67:0.091,68:0.09,69:0.09,70:0.089,71:0.088,72:0.087,73:0.087,74:0.086,75:0.085,76:0.085,77:0.084,78:0.083,79:0.083,80:0.082,81:0.082,82:0.081,83:0.081,84:0.08,85:0.079,86:0.079,87:0.078,88:0.078,89:0.077,90:0.077,91:0.076,92:0.076,93:0.076,94:0.075,95:0.075,96:0.074,97:0.074,98:0.073,99:0.073,100:0.072,101:0.072,102:0.072,103:0.071,104:0.071,105:0.07,106:0.07,107:0.07,108:0.069,109:0.069,110:0.069,111:0.068,112:0.068,113:0.068,114:0.067,115:0.067,116:0.067,117:0.066,118:0.066,119:0.066,120:0.065,121:0.065,122:0.065,123:0.064,124:0.064,125:0.064,126:0.064,127:0.063,128:0.063,129:0.063,130:0.062,131:0.062,132:0.062,133:0.062,134:0.061,135:0.061,136:0.061,137:0.061,138:0.06,139:0.06,140:0.06,141:0.06,142:0.059,143:0.059,144:0.059,145:0.059,146:0.058,147:0.058,148:0.058,149:0.058,150:0.057}
    var n = parseFloat( $('div.text', this).html().replace(/<span.*?<\/span>/g,'').replace(/[^\d.]/g, '') ),
        n1 = parseFloat( $('div.text',this).find('span').html().replace(/[^\d.]/g, '') ),
    
        t = '';
    if(n1) {
       var kvala=parseInt($('span.mainValue', this).text());
       var uskorenie=parseFloat($('p.special', this).text().replace(/\ускорение роста после покупки квалификации за очки: /g, ""));
  var  prirostposle=n1+n1*(uskorenie/100);
     prirostposle=Math.round(prirostposle * 100) / 100 ;
      var ideal=Math.round(maxprir[kvala]*100*100)/100
      t = '\nРост квалификации\n\За пересчет: ' + n1 +' %\nИдеал: '+ideal+' %\nПосле снятия штрафа: '+prirostposle+ ' %\nОсталось дней: ' +  Math.floor( (100-n)/n1 ) ;
     $('div.text',this).find('span').html( $('div.text',this).find('span').html().replace('за пересчёт', 'рост') + ' / ' + ( Math.floor( (100-n)/n1 ) ) + ' д.' );
    }
    $('div.text',this).attr('title', 'Всего: ' + n + ' %' + t);
//    $(this).html('<b>' + $(this).html() + '</b>'); // откройте если хотите жирным шрифтом
    $('div.text',this).css('color', '#fff');
    $('div.text',this).parent().css('background-color', '#696969');
    $('div.text',this).parent().find('div.fill1').css('background-color', '#3388FF');
    $('div.text',this).parent().find('div.fill2').css('background-color', '#7fb4ff');
  });
}

if(window.top == window) {
  $('head').append( '<script type="text/javascript"> (' + run.toString() + ')(); </script>' );
}