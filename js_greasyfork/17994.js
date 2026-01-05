// ==UserScript==
// @name          PRT Online Ext
// @description	  Rozszerzenie toola PRT Online
// @author        dudek
// @include	  *gpro.net/*/Qualify.asp*
// @include	  *gpro.net/*/Qualify2.asp*
// @include	  *gpro.net/*/Testing.asp*
// @include       http://54.185.151.188/set
// @version       0.8.0
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.js
// @require       https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant         GM.getValue
// @grant         GM.setValue
// @namespace https://greasyfork.org/users/33591
// @downloadURL https://update.greasyfork.org/scripts/17994/PRT%20Online%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/17994/PRT%20Online%20Ext.meta.js
// ==/UserScript==

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

(async () => {
  
  var setWSval;
  var q1psFW;
  var q1psRW;  
  var q1psENG;
  var q1psBRA;
  var q1psGEA;
  var q1psSUS;
  
  var q1lhlWIN;
  var q1lhlENG;
  var q1lhlBRA;
  var q1lhlGEA;
  var q1lhlSUS;
  
  var q2psFW;
  var q2psRW;  
  var q2psENG;
  var q2psBRA;
  var q2psGEA;
  var q2psSUS;
  
  var tpsFW;
  var tpsRW;  
  var tpsENG;
  var tpsBRA;
  var tpsGEA;
  var tpsSUS;

  var dateTime;
  
  if( $("#setTable").length )
    //we are on set page
    {
      GM.setValue('q1psFW',  $("#q1psFW").text() );
      GM.setValue('q1psRW',  $("#q1psRW").text() );      
      GM.setValue('q1psENG',  $("#q1psENG").text() );
      GM.setValue('q1psBRA',  $("#q1psBRA").text() );
      GM.setValue('q1psGEA',  $("#q1psGEA").text() );
      GM.setValue('q1psSUS',  $("#q1psSUS").text() );
      
      GM.setValue('q1lhlWIN',  $("#q1lhlWIN").text() );
      GM.setValue('q1lhlENG',  $("#q1lhlENG").text() );
      GM.setValue('q1lhlBRA',  $("#q1lhlBRA").text() );
      GM.setValue('q1lhlGEA',  $("#q1lhlGEA").text() );
      GM.setValue('q1lhlSUS',  $("#q1lhlSUS").text() );
      
      GM.setValue('q2psFW',  $("#q2psFW").text() );
      GM.setValue('q2psRW',  $("#q2psRW").text() );      
      GM.setValue('q2psENG',  $("#q2psENG").text() );
      GM.setValue('q2psBRA',  $("#q2psBRA").text() );
      GM.setValue('q2psGEA',  $("#q2psGEA").text() );
      GM.setValue('q2psSUS',  $("#q2psSUS").text() );
      
      GM.setValue('tpsFW',  $("#tpsFW").text() );
      GM.setValue('tpsRW',  $("#tpsRW").text() );      
      GM.setValue('tpsENG',  $("#tpsENG").text() );
      GM.setValue('tpsBRA',  $("#tpsBRA").text() );
      GM.setValue('tpsGEA',  $("#tpsGEA").text() );
      GM.setValue('tpsSUS',  $("#tpsSUS").text() );      
      
      GM.setValue('setWSval',  $("#setWSval").text() );
      GM.setValue('dateTime',  new Date().toJSON().slice(0,16).replace('T',' ') );
    }
  else
    {
      q1psFW = await GM.getValue('q1psFW');
      q1psRW = await GM.getValue('q1psRW');      
      q1psENG = await GM.getValue('q1psENG');
      q1psBRA = await GM.getValue('q1psBRA');
      q1psGEA = await GM.getValue('q1psGEA');
      q1psSUS = await GM.getValue('q1psSUS');
      
      q2psFW = await GM.getValue('q2psFW');
      q2psRW = await GM.getValue('q2psRW');      
      q2psENG = await GM.getValue('q2psENG');
      q2psBRA = await GM.getValue('q2psBRA');
      q2psGEA = await GM.getValue('q2psGEA');
      q2psSUS = await GM.getValue('q2psSUS');
      
      q1lhlWIN = await GM.getValue('q1lhlWIN');
      q1lhlENG = await GM.getValue('q1lhlENG');
      q1lhlBRA = await GM.getValue('q1lhlBRA');
      q1lhlGEA = await GM.getValue('q1lhlGEA');
      q1lhlSUS = await GM.getValue('q1lhlSUS');
      
      tpsFW = await GM.getValue('tpsFW');
      tpsRW = await GM.getValue('tpsRW');      
      tpsENG = await GM.getValue('tpsENG');
      tpsBRA = await GM.getValue('tpsBRA');
      tpsGEA = await GM.getValue('tpsGEA');
      tpsSUS = await GM.getValue('tpsSUS');
        
      dateTime = await GM.getValue('dateTime');
      
      setWSval = await GM.getValue('setWSval');
    }  

  
  if( window.location.href.indexOf("Qualify.asp") > -1 ) 
    {
      //practice & Q1 page
      $(".noinputpadding").find('tbody tr:nth-child(1)')
        .after($('<tr>')
            .append($('<th>')
                .attr('colspan',5)
                    .html('<a id="copypsfromtool">[ Online Tool PS WS: '+setWSval+' ]</a> | <a id="copylhlfromtool">[ Online Tool PS-HR/2 ] </a>')

            )
            .append($('<th>')
                .attr('colspan',3)
            )
        );


      var ps="javascript:FillSetup("+q1psFW+","+q1psRW+","+q1psENG+","+q1psBRA+","+q1psGEA+","+q1psSUS+","+0+");";

      $("#copypsfromtool").attr("href",ps);

      var lhl="javascript:FillSetup("+q1lhlWIN+","+q1lhlWIN+","+q1lhlENG+","+q1lhlBRA+","+q1lhlGEA+","+q1lhlSUS+","+0+");";

      $("#copylhlfromtool").attr("href",lhl);
    }
  else if( window.location.href.indexOf("Qualify2.asp") > -1 ) 
    {
      //Q2 page
        $(".noinputpadding").find('tbody tr:nth-child(1)')
        .after($('<tr>')
            .append($('<th>')
                .attr('colspan',5)
                    .html('<a id="copypsfromtool">[ Online Tool PS WS: '+setWSval+' ]</a>')

            )
            .append($('<th>')
                .attr('colspan',3)
            )
        );


      var ps="javascript:QuickLink("+q2psFW+","+q2psRW+","+q2psENG+","+q2psBRA+","+q2psGEA+","+q2psSUS+");";

      $("#copypsfromtool").attr("href",ps);

    }
else 
    {
      //Testing
        $(".noinputpadding").find('tbody tr:nth-child(1)')
        .after($('<tr>')
            .append($('<th>')
                .attr('colspan',5)
                    .html('<a id="copypsfromtool">[ Tool  PS | calculated at '+dateTime+' ]</a>')

            )
            .append($('<th>')
                .attr('colspan',3)
            )
        );


      var ps="javascript:FillSetup("+tpsFW+","+tpsRW+","+tpsENG+","+tpsBRA+","+tpsGEA+","+tpsSUS+","+4+","+180+");";

      $("#copypsfromtool").attr("href",ps);

    }	
	
})();