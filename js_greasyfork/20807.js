$("#gamemode").hide();
$("#region_info").remove();
$("#gamemode_info").remove();
$('.joinParty').remove();
$('.createParty').remove();
$("#locationUnknown").empty();
$("#locationUnknown").remove();
$("#region").remove();
$("#div_lb .header").replaceWith('<img style="width:140px;margin-bottom:5px;" src="http://agarplus-ext.tk/bg.png" >');
$(".partyToken").replaceWith('<input type="text" placeholder="Private Party token" id="privateForm" class="partyToken form-control"></input>')
$(".partyToken").appendTo('#settings');
$("#profile-main").append('<div id="privateParties"><button class="btn btn-primary" style="margin-bottom:10px;height:35px;width:100%;float:right;" onclick="$(\'.partyToken\').val($(\'#privateServer\').val()); connect($(\'#privateServer\').val()); return false">Connect</button><select id="privateServer" class="form-control privateServer" style="height: 35px; display: block; width: 100%; float: left; margin-bottom:-10px"><optgroup label="Servers"><option value="ws://31.186.250.128:8080" default selected>Europe 1</option><option value="ws://31.186.250.128:8090">Europe 2</option><option value="ws://74.91.116.127:8080">North America 1</option><option value="ws://74.91.116.127:8090">North America 2</option><option value="ws://ponerluego">Server by Diego</option></optgroup></select></div>');
$("#privateParties").insertAfter('.arrow-right');
localStorage.removeItem('location');

$("#helloContainer").append('<a href="http://agarplus-ext.tk/" target=" _blank"><img style="width: 206px;margin-bottom: 5px;position: absolute;left: 305px;top: -50px;" src="http://agarplus-ext.tk/bg.gif" ><br></a>');

$(".adsbygoogle").replaceWith('<div id="reklama" style="display: inline-block; width: 300px; margin-bottom: 10px; height: 250px;"><a href="https://www.youtube.com/channel/UC4hgeUm_GCcrxg_v4XInpoQ"><img src="http://agarplus-ext.tk/dario.png"></a><hr>Edited by Anton AL<div>');                            
$("#game_info").replaceWith('<div class="bruh"><script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UCIZ7EtBhjNsLmMVqErMtaow" data-layout="full" data-theme="#363636" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"></div>  Use Tag 333 </div>')
connect ("ws://31.186.250.128:8080");