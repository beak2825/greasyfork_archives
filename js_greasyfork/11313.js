// ==UserScript==
// @name         League Talk Unfollower
// @namespace    Jefreesujit
// @version      2.0
// @description  This script searches for the league you have followed and help you to Unfollow them.
// @author       Jefreesujit
// @match        http://hitwicket.com/discussionForum/112387/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11313/League%20Talk%20Unfollower.user.js
// @updateURL https://update.greasyfork.org/scripts/11313/League%20Talk%20Unfollower.meta.js
// ==/UserScript==

$(".thread_content").html("");
$(".thread_content").append('<meta property="article:tag" content="apps" />'+
'<meta property="article:tag" content="games" />'+
'<meta property="article:tag" content="sports" />'+
'<meta name="keywords"	content="cricket , u20 , hitwicket , league, unfollower, unfollower script, league unfollow , league talk, league talk unfollower, u20 player, hitwicket jefreesujit, jefreesujit " />'+

'<div style="padding-left:0em;"><b>LEAGUE TALK UNFOLLOWER SCRIPT</b></div></br>'+
                            
                            "<div>Searching the Followed leagues in lower divisions (5, 6 and 7) takes more time, so please be patient. <br>"+ 
                            " Please wait till the complete list of folllowed leagues is loaded, before clicking Unfollow All button.</div><div><br><br></div>" +

"<div id='jefree' style=' float: center; text-align: center;' >" +
                            
  "<div style=' float: left; display: inline-block; text-align: center;'> <select id='divisionid' >" +
  "<option value='1'>Division 1</option>" + 
  "<option value='2'>Division 2</option>" + 
  "<option value='3'>Division 3</option>" + 
  "<option value='4'>Division 4</option>" + 
  "<option value='5'>Division 5</option>" + 
  "<option value='6'>Division 6</option>" + 
  "<option value='7'>Division 7</option>" + 
 "</select> </div>" + 

  "<div style=' display: inline-block; float: left; text-align: center; padding-left:5em;'><button id='searchLeague'>Search Leagues</button></div>" + 
                            
  '<div style=" display: inline-block; float: right; padding-right:15em; " >'+
                                     
  '<input type="button" id="subscription" name=" "  value="Unfollow All" class="btn btn-default btn-sm pull-right"  "></div><br><br>'+ 
 
   "<div class='loader' style='display: none;text-align:center;' align='center'><img src='/images/ajax-loader.gif'></div>" +  "<br><br>" +
  
                            "<br><div id='leagueInfo' style='font-size:18px; color:orange; ; '> </div>" + "</div><br><br>"); 

var divisions = ["I","II","III","IV","V","VI","VII"];
    var division;
 var totalLeagues;
 var arr=[];

$('#subscription').hide();

function caldiv(division)
{
    var i,a=0;
    for (i=2; i < division+1 ; i++)
    {
        a=a+ Math.pow(4, division-i);
    }
    if (division == 1)
        return 0;
    else
        return a-(1/3);
}

function startSearch() {
    $('#searchLeague').attr('disabled','disabled');
  var currentLeague = 1;
    	$("div#leagueInfo").html("");
  		division = $("#divisionid").val();
       totalLeagues = Math.pow(4,division-1);
    	console.debug($("#divisionid").val());
       searchLeague(currentLeague);
    }
    
    function searchLeague(currentLeague) {    
    console.debug("inside searchLeague");
    $(".loader").show();
    var url = "http://hitwicket.com/league/show/" ;   
    var currentLeagueName = divisions[division-1] + "-" + currentLeague;
    var leagueUrl = url + currentLeagueName;
    console.debug("before request");
    $.ajax({
      url: leagueUrl,
      cache: false,
        beforeSend: function( xhr ) {
            $(".loader").show();
        }
    })
      .done(function( html ) {          
          console.debug(currentLeagueName + ":" + $(html).find("#subscription").val());
    var val = $(html).find("#subscription").val();
    //var val= $("#subscription").val();
    //window.alert(val);
    var appd = " and unfollow" ;      
    var disp =  "<a href='" + leagueUrl + "'>Visit " + currentLeagueName + " </a> " + appd + "<br>" ;
    if(val == "Unfollow" ) {
         $('#subscription').show();
         var ax=caldiv(division);
          //alert(ax);
          var abc = ax + currentLeague;
        if ( $.inArray( abc, arr) == -1 ) {
            arr.push(abc); }
          var ele = "<div >" + disp + "</div>";
          $("div#leagueInfo").append(ele );
          
          //$('#subscription').attr('name', abc );
          }

          currentLeague++;
          if(currentLeague > totalLeagues) {
               $(".loader").hide();
             $('#searchLeague').removeAttr('disabled');
              return;
          }
          else {
           	searchLeague(currentLeague);   
          }
        
    });    
  }    

$(document).on('click', '#searchLeague', function(){
        startSearch();
    }
);

        $('#subscription').live('click',function(){
          //var xyz=$('#subscription').attr('name');
          var bs=confirm("Are you sure to Unfollow All leagues in this division?");
          //alert(arr.length);
            if (bs === true ) {  
            var i;
            for(i=0; i < arr.length ; i++)
            {
                //alert(arr[i]);
                $.ajax({
                    'type':'post',
            'url':"/league/changeSubscription?league_id="+arr[i] ,
            'cache':false,
                    'success':function(data){
                            var label = $('#subscription').attr('value');
                        if(label == 'Unfollow') 
                                $('#subscription').attr('value','Follow');
                                
                                                      
                          }
                 });                
            }  
            $('#subscription').hide(); 
            alert("Successfully Unfollowed All leagues!");
            return false;
          }
            
       });