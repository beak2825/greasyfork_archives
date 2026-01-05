// ==UserScript==
// @name           Peter Market Tool
// @namespace      Peter Market Tool
// @description    Peter Market Tool for eRepublik
// @author         fpeter76
// @match          http://www.erepublik.com/PMT
// @include        http://www.erepublik.com/PMT
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version        0.3
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/5375/Peter%20Market%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/5375/Peter%20Market%20Tool.meta.js
// ==/UserScript==

(function(){
    var one_time = 5;
    var randTime=0;
    var mymc;
	var mylc;
    var update_items_name = {1:{1:'',2:'',3:'',4:'',5:'',6:'',7:''},2:{1:'',2:'',3:'',4:'',5:'',6:'',7:''},3:{1:'',2:'',3:'',4:'',5:''},4:{1:'',2:'',3:'',4:'',5:'',6:'',7:''},7:{1:''},12:{1:''},17:{1:''}};
    var autopurchase = 0;
    var autoupdate = 1;
    var wait_min = 5;
    var wait_max = 10;
    var update_items = {1:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},2:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},3:{1:0,2:0,3:0,4:0,5:0},4:{1:0,2:0,3:0,4:0,5:0,6:0,7:0},7:{1:0},12:{1:0},17:{1:0}};
    var update_items_p = { 
        1: { 1:"0.0" , 2:"0.0" , 3:"0.0" , 4:"0.0" , 5:"0.0" , 6:"0.0" , 7:"0.0" } ,
        2: { 1:"0.0" , 2:"0.0" , 3:"0.0" , 4:"0.0" , 5:"0.0" , 6:"0.0" , 7:"0.0" } , 
        3: { 1:"0.0" , 2:"0.0" , 3:"0.0" , 4:"0.0" , 5:"0.0" } , 
        4: { 1:"0.0" , 2:"0.0" , 3:"0.0" , 4:"0.0" , 5:"0.0" , 6:"0.0" , 7:"0.0" } , 
        7: { 1:"0.0" } , 
		12:{ 1:"0.0" } , 
		17:{ 1:"0.0" }
		} ;

    function saveSetting ()
	{
        var data =new function ()
                    {
                        this.autopurchase = autopurchase;
                        this.autoupdate = autoupdate;
                        this.wait_min = wait_min;
                        this.wait_max = wait_max;
                        this.update_items = update_items;
                        this.update_items_p = update_items_p;
                    }();
        localStorage.setItem("PMT_Setting",JSON.stringify(data));
    }
	function loadSetting ()
	{
        var PMT_Setting = localStorage.getItem("PMT_Setting");
        if(PMT_Setting!=null)
        {
            PMT_Setting = JSON.parse(PMT_Setting);
            autopurchase = PMT_Setting.autopurchase;
            autoupdate = PMT_Setting.autoupdate;
            wait_min = PMT_Setting.wait_min;
            wait_max = PMT_Setting.wait_max;
            update_items = PMT_Setting.update_items;
            update_items_p = PMT_Setting.update_items_p;
        }
    }
    loadSetting ();

	var mc_clist_arr = [81,65,35,13,24,14,1,11,49,44,9,42,43,63,27,79,58,28,53,
		67,74,77,75,52,41,59,29,68,30,38,
		15,47,51,61,40,36,166,37,73,70,55,
		82,78,64,23,69,76,32,83,33,39,12,
		48,84,31,80,26,66,72,71,45,10,54,
		56,50,34,165,57,164,167,168,169,170,171];

	var mc_name_arr = {
		81:'TAIWAN',65:'SERBIA',35:'POLAND',13:'HUNGARY',24:'USA',1:'ROMANIA',
		11:'FRANCE',49:'INDONESIA',44:'GREECE',14:'CHINA',9:'BRAZIL',42:'BULGARIA',
		43:'TURKEY',63:'CROATIA',27:'ARGENTINA',79:'MACEDONIA',58:'ISRAEL',28:'VENEZUELA',
		53:'PORTUGAL',67:'PHILIPPINES',74:'URUGWAY',77:'PERU',75:'PARAGWAY',52:'REPUBLIC_OF_MOLDOVIA',
		41:'RUSSIA',59:'THAILAND',29:'UNITED_KINGDOM',68:'SINGAPORE',30:'SWITZERLAND',38:'SWEDEN',
		15:'SPAIN',47:'SOUTH_KOREA',51:'SOUTH_AFRICA',61:'SLOVENIA',40:'UKRAINE',36:'SLOVAKIA',
		166:'ARAB_EMIRATES',37:'NORWAY',73:'NORTH_KOREA',70:'ESTONIA',55:'DENMARK',82:'CYPRUS',
		78:'COLOMBIA',64:'CHILE',23:'CANADA',69:'BOSNIA',76:'BOLIVIA',32:'BELGIUM',83:'BELARUS',
		33:'AUSTRIA',39:'FINLAND',12:'GERMANY',48:'INDIA',84:'NEW_ZELAND',31:'NETHERLANDS',
		80:'MONTENEGRO',26:'MEXICO',66:'MALAYSIA',72:'LITHUANIA',71:'LATVIA',45:'JAPAN',10:'ITALY',
		54:'IRELAND',56:'IRAN',50:'AUSTRALIA',34:'CZECH',165:'EGYPT',57:'PAKISTAN',164:'SAUDI_ARABIA',
		167:'ALBANIA',168:'GEORGIA',169:'ARMENIA',170:'NIGERIA',171:'CUBA'};

	var mc_url_arr={81:'Republic-of-China-Taiwan',65:'Serbia',35:'Poland',13:'Hungary',24:'USA',1:'Romania',
		11:'France',49:'Indonesia',44:'Greece',14:'China',9:'Brazil',42:'Bulgaria',
		43:'Turkey',63:'Croatia',27:'Argentina',79:'Republic-of-Macedonia-FYROM',58:'Israel',28:'Venezuela',
		53:'Portugal',67:'Philippines',74:'Uruguay',77:'Peru',75:'Paraguay',52:'Republic-of-Moldova',
		41:'Russia',59:'Thailand',29:'United-Kingdom',68:'Singapore',30:'Switzerland',38:'Sweden',
		15:'Spain',47:'South-Korea',51:'South-Africa',61:'Slovenia',40:'Ukraine',36:'Slovakia',
		166:'United-Arab-Emirates',37:'Norway',73:'North-Korea',70:'Estonia',55:'Denmark',82:'Cyprus',
		78:'Colombia',64:'Chile',23:'Canada',69:'Bosnia-Herzegovina',76:'Bolivia',32:'Belgium',83:'Belarus',
		33:'Austria',39:'Finland',12:'Germany',48:'India',84:'New-Zealand',31:'Netherlands',
		80:'Montenegro',26:'Mexico',66:'Malaysia',72:'Lithuania',71:'Latvia',45:'Japan',10:'Italy',
		54:'Ireland',56:'Iran',50:'Australia',34:'Czech-Republic',165:'Egypt',57:'Pakistan',164:'Saudi-Arabia',
		167:'Albania',168:'Georgia',169:'Armenia',170:'Nigeria',171:'Cuba'};

	var currency = "cc";

	var items_html="<br><table border='1'  cellpadding='2' style='background-color: rgb(209, 204, 198); opacity: 0.8;'>";
	{
		for(var i in update_items)
		{
			for(var j in update_items[i])
			{
				if(j==1&&i!=12&&i!=17)
					items_html = items_html + "<tr>";
                items_html = items_html +"<td><INPUT TYPE='checkbox'  id='ilist_"+i+"_"+j+"' value='"+update_items_name[i][j] + "' ";
				if(update_items[i][j]==1)
					items_html = items_html +"checked";
                items_html = items_html + " />";
                items_html = items_html + "<a onclick=\"document.getElementById('ilist_"+i+"_"+j+"').click()\">";
                if(i<=4)
                	update_items_name[i][j]= "Q" + j +"<img src='http://s1.www.erepublik.net/images/icons/industry/"+i+"/q"+j+"_30x30.png' height=20>"; 
                else
                	update_items_name[i][j]="<font color='#FFF'>&nbsp&nbsp&nbsp&nbsp&nbsp</font><img src='http://s1.www.erepublik.net/images/icons/industry/"+i+"/default_30x30.png' height=20>"; 
                items_html = items_html + update_items_name[i][j] + "</a><INPUT TYPE='text' id='autolist_"+i+"_"+j+"' value='"+update_items_p[i][j]+"' size='5'/></td>";
				if(j==7)
					items_html = items_html + "</tr>";
			}
		}
	}
	items_html = items_html + "</table>";
	
	$( "html" ).html ("<title>Peter Market Tool Auto Shopping</title>"+
                      "<table><tr valign=top><td><h3><b>PMT Auto Shopping</b></h3>"+
					  "<a target='_blank' href='http://www.erepublik.com/en/economy/donate-money/8325225' >If you like, please donate!</a>"+ //8325225
                      "<hr></hr><table border='1'  cellpadding='2' style='background-color: rgb(209, 204, 198); opacity: 0.8;'>"+
                      "<tr><td>Nationality: </td><td><canvas class='loading' width='16' height='16'></canvas><b id='mymc'>(n.a.)</b></td></tr>"+
                      "<tr><td>Location: </td><td><canvas class='loading' width='16' height='16'></canvas><b id='mylc'>(n.a.)</b></td></tr>"+
                      "<tr><td>Warehouse: </td><td><canvas class='loading' width='16' height='16'></canvas><b id='inventory'>(n.a.)</b></td></tr>"+
                      "<tr><td>CSRFtoken: </td><td><canvas class='loading' width='16' height='16'></canvas><b id='token'>(n.a.)</b></td></tr>"+
                      "</table>"+items_html+"<HR />"+
					  "<table border='1'  cellpadding='2' style='background-color: rgb(209, 204, 198); opacity: 0.8;'><tr valign=top><td>" +
                      "<INPUT TYPE='checkbox' id='auto' "+((autoupdate)?"checked":"")+"\><a onclick=\"document.getElementById('auto').click()\">Auto update</a>  "+
                      "<INPUT TYPE='button' onclick='if(confirm(\"Are you sure?\")){localStorage.removeItem(\"PMT_Setting\");location.reload();}' value='Reset'\><br>"+
					  "</td></tr>" +
					  "<tr valign=top><td>" +
                      "<INPUT TYPE='checkbox' id='autopurchase' "+((autopurchase)?"checked":"")+
					  "\><a onclick=\"document.getElementById('autopurchase').click()\">Auto purchase</a><br>"+
					  "</td></tr>" +
					  "<tr valign=top><td>" +
                      "Update interval: <INPUT TYPE='text' id='wait_min' value='"+wait_min+"' size=1\>~<INPUT TYPE='text' id='wait_max' value='"+wait_max+"' size=1\>"+
//                      "<INPUT TYPE='button' id='update_button' onClick='this.value=\"Update\"; this.disabled=true;  ' value='Start' />" +
                      "<INPUT TYPE='button' id='update_button' onClick='this.value=\"Update\"; this.disabled=true;  ' value='Update' disabled='true'/>" +
					  "</td></tr>" +
					  "<tr valign=top><td>" +
					  "<div id='header_data'></div>" +
					  "</td></tr>" +
					  "</table>" +
					  "<hr></hr>" +
					  "<div id='data'></div>" +
                      "</td><td><table id='buyLog' border='1'  cellpadding='2' style='background-color: rgb(209, 204, 198); opacity: 0.8;'>" +
					  "<tr><td colspan='5' align='center' style='padding:10px;'>Log</td></tr>" +
					  "<tr><td style='padding:5px;'>Date time</td><td style='padding:5px;'>Country</td><td style='padding:5px;'>Sum. price</td><td style='padding:5px;'>Item</td><td style='padding:5px;'>Amount * Price</td></tr>" +
					  "</table></td></tr>"+
					  "</td></tr>" +
                      "</table>") ;
    document.body.style.background="#D1CCC6 url(http://www.erepublik.com/images/modules/ambients/external/home_bg.jpg) no-repeat 50% 0%";
   	update();
	var mc_id_arr ;
	var mc=0; 
	var mcP=0; 
	var times=0;
	var time=0;
    var max_time=0;
	var mc_arr;
	var inventory = 0;
	var token = "";
  
	function getAllData()
	{
        mcP = 0; 
		times = 0;
        time = 0;
        $( "#header_data" ).html ( "Update! Please wait!<br><progress id='times' value=\"0\" max=\"1\">" ) ;
        timedown ( );
		var url = "http://www.erepublik.com/en/economy/inventory";
		$.ajax(
			{
				url: url,
				context: document.body,
				success: function(html)
				{
					tmp = html.match(/country: '(\d{1,3})'/);
					if(tmp)
						mymc = tmp[1] *1;
					tmp = html.match(/countryLocationId: '(\d{1,3})'/);
					if(tmp)
						mylc = tmp[1] *1;
					tmp = html.match(/name=\"_token\" value=\"([^"]{32,32})\"/);
					if(tmp)
						token = tmp[1];
					tmp = html.match(/\(([0-9,]+)\/([0-9,]+)\)/);
					if(tmp)
					{
						tmp[1] = tmp[1].replace(/,/g,"")*1;
						tmp[2] = tmp[2].replace(/,/g,"")*1;
						inventory = tmp[2] - tmp[1];
					}
					$( "#inventory" ).html(inventory  +" "+ tmp[0]);
					$( "#token" ).html(token);
					$( "#mymc" ).html("<img src='http://s2.www.erepublik.net/images/flags_png/S/"+mc_url_arr[mymc]+".png'/> </td><td>" + mc_url_arr[mymc]);
					$( "#mylc" ).html("<img src='http://s2.www.erepublik.net/images/flags_png/S/"+mc_url_arr[mylc]+".png'/> </td><td>" +mc_url_arr[mylc]);

					for(var i in update_items_name)
					{
						for(var j in update_items_name[i])
						{
							if($("#ilist_"+i+"_"+j).attr("checked")=="checked")
							{
								update_items[i][j]=1;
							}
							else
							{
								update_items[i][j]=0;
							}
						}
					}
					for(var i in update_items)
						for(var j in update_items[i])
							mcP = mcP + update_items[i][j];

					mc_id_arr = new Array()
					mc_id_arr.push(mymc);
					//mc_id_arr.push(mylc);
					if(mymc!=mylc)
						mc_id_arr.push(mylc);
					mc = mc_id_arr.length;
					
					max_time  = mc * one_time; 
					mc_arr = new Array ( );
					for (var i = 0 ; i < mc ; i++ )
						mc_arr [ i ] = new myCountries ( mc_id_arr [ i ] ) ;
                    $("#times").attr("max",((mc * mcP) + 1));
					$("#times").attr("value",1);
					for ( var i = 0 ; i < mc ; i++ )
					{
						mc_arr[ i ].getall( );
					}
                    times++ ;
				},
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    $( "#inventory" ).html("Error");
					$( "#token" ).html("Error");
					$( "#mymc" ).html("Error");
					$( "#mylc" ).html("Error");
                    times++ ;
                }
			});
	}

	function myCountries ( id )
	{
		this.id = id ;
		this.location = 0;
		this.name = mc_name_arr [ id ] ;
		this.url = mc_url_arr [ id ] ;
		this.items 	= { 1:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 2:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 3:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 } , 4:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 7:{ 1:0 } , 12:{ 1:0 } , 17:{ 1:0 } } ;
		this.items_a 	= { 1:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 2:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 3:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 } , 4:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 7:{ 1:0 } , 12:{ 1:0 } , 17:{ 1:0 } } ;
		this.items_id 	= { 1:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 2:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 3:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 } , 4:{ 1:0 , 2:0 , 3:0 , 4:0 , 5:0 , 6:0 , 7:0 } , 7:{ 1:0 } , 12:{ 1:0 } , 17:{ 1:0 } } ;
		
		this.getall = function ( )
		{
			var x=this;
			x.getprice ( 7 , 1 ) ;
			x.getprice ( 12 , 1 ) ;
			x.getprice ( 17 , 1 ) ;
			for ( var i = 1 ; i <= 7 ; i++ )
				x.getprice ( 1 , i ) ;
			for ( var i = 1 ; i <= 7 ; i++ )
				x.getprice ( 2 , i ) ;
			for ( var i = 1 ; i <= 5 ; i++ )
				x.getprice ( 3 , i );
			for ( var i = 1 ; i <= 7 ; i++ )
				x.getprice ( 4 , i ) ;
		}

		this.getprice = function(item,level)
		{
			if(update_items[item][level]==0)
			{
				return;
			}
			var getURL = "http://www.erepublik.com/en/economy/market/" + this.id + "/" + item + "/" + level + "/citizen/0/price_asc/1" ;
			var x = this ;
			$.ajax(
			{
				url : getURL ,
				context : document.body ,
				success : function( html )
				{
                    tmp = html.match(/productId_(\d+)\"[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^0-9]+([0-9,]+)[^>]+>[^>]+>[^>]+>[^0-9.]?(\d+)[^>]+>[^>]+>[^0-9.]?([0-9.]+)/);
					//tmp = html.match(/id=\"(\d+)\"[^=]+=[^=]+=[^=]+=\"([0-9.]+)\"[^=]+=\"(\d+)\"/);
					x.items_id [ item ] [ level ] = tmp[1] ; 
					x.items [ item ] [ level ] = (tmp[3]+tmp[4]) * 1 ;
					x.items_a [ item ] [ level ] = tmp[2].replace(/,/g,"")*1;
					times++ ;
				},
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    times++ ;
                }
			});
		}
	}

	//Alsó táblázat
	function showtable()
	{
		var str="";
		str= str + "<table border='1'  cellSpacing='0' style='white-space: nowrap; background-color: rgb(209, 204, 198); opacity: 0.8;'>";
		str=str+"<tr><td Width='100px' align='center'>Country</td>";
		for(var i=0;i<mc;i++)
			str=str+"<td Width='250px' align='center' colspan='2'>"+ mc_arr[i].name+"<img src='http://s2.www.erepublik.net/images/flags_png/S/"+mc_url_arr[mc_arr[i].id]+".png'/></td>";
		str=str+"</tr>";
		
		for(var i in update_items)
			for(var j in update_items[i])
				if(update_items[i][j]==1)
				{
					str=str+"<tr><td align='center'>"+update_items_name[i][j]+"</td>";
					for(var k=0;k<mc;k++)
					{
						str = str + "<td align='center'>";
						str = str + "<a href='"+"http://www.erepublik.com/en/economy/market/" + mc_arr[k].id + 
							"/" + i+ "/" +j+ "/citizen/0/price_asc/1"+"' target='_blank'>"+ mc_arr[k].items[i][j]+"</a>"; // + " ("+mc_arr[k].items_a[i][j]+")";
						amount = ((mc_arr[k].items_a[i][j] < inventory)?mc_arr[k].items_a[i][j]:inventory);

						str = str + "<td align='center'>";
						if(amount>0)
						{
							str = str + "<form target='_blank'  method='post' action='http://www.erepublik.com/en/economy/market/" + mc_arr[k].id + "/" + i+ "/" +j+ "/citizen/0/price_asc/1'>";
							str = str + "<input type='hidden' name='amount' value="+amount+" />";
							str = str + "<input type='hidden' name='offerId' value="+mc_arr[k].items_id[i][j]+" />";
							str = str + "<input type='hidden' name='_token' value="+token+" />";
							str = str + "<input type='submit' value='Buy "+amount+" pcs.'/>";
							str = str + "</form>";
						}
						str = str + "</td>";
						
                        update_items_p[i][j] = document.getElementById("autolist_"+i+"_"+j).value;
                        autopurchase = ($("#autopurchase").attr("checked")=="checked")?1:0;
						if((amount>0)&&(autopurchase==1)&&( mc_arr[k].items[i][j] > 0 )&&((update_items_p[i][j]*1) >= mc_arr[k].items[i][j]))
						{
							var d = new Date();
							var datetimeStr = (d.getMonth()+1) + "/" + ((d.getDate()<10)?"0":"")+ d.getDate() + " " + ((d.getHours()<10)?"0":"")+ d.getHours()  + 
								":" + ((d.getMinutes()<10)?"0":"")+ d.getMinutes() + ":" + ((d.getSeconds()<10)?"0":"")+ d.getSeconds();
							buyurl = "http://www.erepublik.com/en/economy/market/" + mc_arr[k].id + "/" + i+ "/" +j+ "/citizen/0/price_asc/1";
							buydata = "amount="+amount+"&offerId="+mc_arr[k].items_id[i][j]+"&_token="+token;
							buyLogData = datetimeStr + '</td><td>' + mc_arr[k].name + '</td><td>' + (mc_arr[k].items[i][j]*amount).toFixed(2)+' '+ currency + //currencies[mymc]+
								 '</td><td>' + update_items_name[i][j] + 
								 '</td><td>' + amount + ' * ' + mc_arr[k].items[i][j];
							$.ajax(
								{
									url: buyurl,
									type: 'POST',
									data:buydata,
									success: function(html)
									{
										if(html.search("success_message")>0)
											document.getElementById('buyLog').innerHTML += "<tr><td>" + buyLogData + "</td></tr>";
									}
								}
							);
						}
						str = str + "</td>";
					}
					if (mc>1)
					{
						if ((mc_arr[0].items[i][j] - mc_arr[1].items[i][j]) < 0)
						{
							str = str + "<td align='center' style='color:red'>";
						}
						if ((mc_arr[0].items[i][j] - mc_arr[1].items[i][j]) > 0)
						{
							str = str + "<td align='center' style='color:green'>";
						}
						if ((mc_arr[0].items[i][j] - mc_arr[1].items[i][j]) == 0)
						{
							str = str + "<td align='center' style='color:blue'>";
						}
						str = str + (mc_arr[0].items[i][j] - mc_arr[1].items[i][j]).toFixed(2);
						str = str + "</td>";
					}
					str=str+"</tr>";
				}
		str=str+"</table>";
		$("#header_data").html("");
		$("#data").html(str);
	}
	
	function getColorTD(value)
	{
		str= ""
		if(value<=0)
			str = str + "<td>";
		else if (value>=1)
			str = str +"<td bgcolor='blue'>";
		else if (value>=0.5)
			str = str +"<td bgcolor='red'>";
		else
			str = str +"<td bgcolor='yellow'>";
		str = str + (value*100).toFixed(2);
		str = str + "%</td>";
		return str;
	}
	
	function timedown()
	{
        saveSetting ();
		if((times<(mc*mcP)+1)&&(time<max_time+one_time))
		{
            $("#times").attr("value",times);		
			time++;
			setTimeout(timedown,1000);
		}
		else
		{
			showtable();
			var checked = $( "#auto").attr("checked");
			if(checked!="checked")
			{
                autoupdate = 0;
				$("#update_button").val("Start");
				$("#update_button").removeAttr("disabled");
				setTimeout(update,10);
			}
			else
			{
                autoupdate = 1;
				wait_min = $("#wait_min").val()*1;
				wait_max = $("#wait_max").val()*1;
				randTime = Math.floor((Math.random() * (wait_max - wait_min)) + wait_min);
				$("#header_data").html("The update is complete! Wait " +randTime+ " seconds!<br><progress id='times' value=\"0\" max=\""+randTime+"\">");
				setTimeout(timecount,10);
			}
		}
	}
    function timecount()
    {
        $("#times").attr("value",randTime);
        if(randTime>0)
        {
            randTime--;
        	setTimeout(timecount,(1000));
        }
        else
        {
            setTimeout(update,10);
        }
            
    }
	
	function update()
	{
		if($("#update_button").val()=="Update")
			getAllData();
		else
			setTimeout(update,100);
	}
})();
