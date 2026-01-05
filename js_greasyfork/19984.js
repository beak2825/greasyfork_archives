// ==UserScript==
// @name        WME-QuickSetupProperties
// @namespace   https://greasyfork.org/ru/scripts/19984-wme-quicksetupproperties
// @description Quick setup the properties of objects in the WME
// @include     https://*.waze.com/*editor*
// @version     2.12.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19984/WME-QuickSetupProperties.user.js
// @updateURL https://update.greasyfork.org/scripts/19984/WME-QuickSetupProperties.meta.js
// ==/UserScript==

var wmeQSP_version = "2.12.1.0";
console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): Start");

// TODO: подумать над сортировкой
// TODO: скорости вне НП и штаты

var wmeQSP_debug=false;
var wmeQSP_AI_On=true;
var wmeQSP_CityName='';
var wmeQSP_cloneAddress=true;
var wmeQSP_cloneAddressAbs=false;
var wmeQSP_ConfigSegments = {};
var wmeQSP_ConfigOrderSegments = [];
var wmeQSP_Colors = {};

var WazeActionUpdateObject = null;
var WazeActionUpdateFeatureAddress = null;

function CreateID()
{
	return 'WME-QSP-' + wmeQSP_version.replace(/\./g,"-");
}

function getElementsByClassName(classname, node)
{
	if(!node)
		node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}

function WmeQSP_bootstrap()
{
	console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_bootstrap()");
    if(typeof require === "undefined")
    {
		setTimeout(WmeQSP_bootstrap, 100);
		return;
    }

	if (typeof I18n === "undefined")
	{
		setTimeout(WmeQSP_bootstrap, 100);
		return;
	}
	if (typeof I18n.translations === "undefined")
	{
		setTimeout(WmeQSP_bootstrap, 100);
		return;
	}
	if (typeof W.selectionManager === "undefined")
	{
		setTimeout(WmeQSP_bootstrap, 100);
		return;
	}

    if (typeof require === "undefined")
    {
        setTimeout(WmeQSP_bootstrap,1000);
        return;
    }

    WazeActionUpdateObject = require('Waze/Action/UpdateObject');
    WazeActionUpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');


	wmeQSP_debug            = __GetLocalStorageItem("wmeQSP_debug",'bool',true);
	wmeQSP_cloneAddress     = __GetLocalStorageItem("wmeQSP_cloneAddress",'bool',true);
	wmeQSP_cloneAddressAbs  = __GetLocalStorageItem("wmeQSP_cloneAddressAbs",'bool',false);
	wmeQSP_AI_On            = __GetLocalStorageItem("wmeQSP_AI_On",'bool',true);
	wmeQSP_CityName         = __GetLocalStorageItem("wmeQSP_CityName",'string','');

	var wmeQSP_Colors0      = __GetLocalStorageItem("wmeQSP_Colors",'string','');
	if (wmeQSP_Colors0 && IsJsonString(wmeQSP_Colors0))
		wmeQSP_Colors=JSON.parse(wmeQSP_Colors0);
	else
	{
		wmeQSP_Colors= {
			 "1":{color:'#ffffeb'},
			 "2":{color:'#f0ea58'},
			 "3":{color:'#c577d2'},
			 "4":{color:'#b3bfb3'},
			 "5":{color:'#b0a790'},
			 "6":{color:'#45b8d1'},
			 "7":{color:'#69bf88'},
			 "8":{color:'#867342'},
			"10":{color:'#9a9a9a'},
			"15":{color:'#d7d8f8'},
			"16":{color:'#999999'},
			"17":{color:'#beba6c'},
			"18":{color:'#c62925'},
			"19":{color:'#ffffff'},
			"20":{color:'#ababab'}
		};
		localStorage.setItem("wmeQSP_Colors",JSON.stringify(wmeQSP_Colors));
	}

	var wmeQSP_ConfigOrderSegments0 = __GetLocalStorageItem("wmeQSP_ConfigOrderSegments",'string',"3,4,6,7,2,1,8,20,17,15,5,10,16,18,19");
	if (wmeQSP_ConfigOrderSegments0)
		wmeQSP_ConfigOrderSegments=wmeQSP_ConfigOrderSegments0.split(",");

	var wmeQSP_ConfigSegments0 = __GetLocalStorageItem("wmeQSP_ConfigSegments",'string','');
	if (wmeQSP_ConfigSegments0 && IsJsonString(wmeQSP_ConfigSegments0))
		wmeQSP_ConfigSegments=JSON.parse(wmeQSP_ConfigSegments0);


	setTimeout(WmeQSP_Initialise, 100);
}


function __reselectItem()
{
	var savedItem=W.selectionManager.getSelectedFeatures()[0].model;
	W.selectionManager.unselectAll();
	setTimeout(function() {W.selectionManager.select([savedItem]);}, 60);
}

//wait 3 seconds before launching the script
function WmeQSP_Initialise()
{
	if(wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_Initialise(): "+"typeof W.selectionManager="+(typeof W.selectionManager));
	try{
		W.selectionManager.events.register("selectionchanged", null, WmeQSP_Main);
	}catch(e){console.log(e);}
	//try{ W.map.events.register("drag", null, WmeQSP_Main); }catch(e){console.log(e);}

	// TODO: подумать над сортировкой

	// get localize name
	var road_types=I18n.translations[I18n.locale].segment.road_types;

	var Config =[
		{handler: 'WMEShiftSelectedNode', title: 'Сдвинуть жанкшин', func: WmeQSP_ModifySelectedNode, key:-1, arg:  null}
	];

	for(var level=-5; level <= 9; ++level)
	{
		var it={handler: 'WMEChangeLevel_'+(level+5),  title: (I18n.translations[I18n.locale].edit.segment.fields.level+" "+level), func: WmeQSP_ChangeLevel, key:-1, arg: {level:level}};
		Config.push(it);
	}

	for(var os=0; os < wmeQSP_ConfigOrderSegments.length; ++os)
	{
		let prop=wmeQSP_ConfigOrderSegments[os];
		var it0={handler: 'WMEChangeSelSegment_'+prop, title: road_types[prop], func: WmeQSP_ModifySelectedSegments0, key:-1, arg: {roadType:parseInt(prop)}};
		Config.push(it0);
		if (typeof wmeQSP_ConfigSegments[prop] === "undefined")
			wmeQSP_ConfigSegments[prop]={"speedIn":{},"speedOut":{},"Lock":{},"Interface":{},"needName":{}};
        if(typeof wmeQSP_ConfigSegments[prop].needName === "undefined")
            wmeQSP_ConfigSegments[prop].needName={};
	}

	for(let prop in road_types)
	{
		var found=false;
		for(var j in Config)
		{
			if(Config[j].arg && Config[j].arg.roadType === parseInt(prop))
				found=true;
		}
		if (!found || typeof wmeQSP_ConfigSegments[prop] === "undefined")
		{
			wmeQSP_ConfigOrderSegments.push(prop);
			let it0={handler: 'WMEChangeSelSegment_'+prop, title: road_types[prop], func: WmeQSP_ModifySelectedSegments0, key:-1, arg: {roadType:parseInt(prop)}};
			Config.push(it0);
			if (typeof wmeQSP_ConfigSegments[prop] === "undefined")
				wmeQSP_ConfigSegments[prop]={"speedIn":{},"speedOut":{},"Lock":{},"Interface":{},"needName":{}};
            if(typeof wmeQSP_ConfigSegments[prop].needName === "undefined")
                wmeQSP_ConfigSegments[prop].needName={};
		}

		//wmeQSP_ConfigSegments[prop]={"speedIn":{"fwdMaxSpeed":60,"revMaxSpeed":60},"speedOut":{"fwdMaxSpeed":90,"revMaxSpeed":90}};
	}
	for(var i=0; i < Config.length; ++i)
		WMEKSRegisterKeyboardShortcut('WME-QuickSetupProperties', 'WME-QuickSetupProperties', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
    WMEKSLoadKeyboardShortcuts('WME-QuickSetupProperties');
	window.addEventListener("beforeunload", function() {WMEKSSaveKeyboardShortcuts('WME-QuickSetupProperties');}, false);

	WmeQSP_InitConfig();
}

function PtInPoly(x, y, components)
{
	let npol = components.length;
	let jj = npol - 1;
	var c = 0;
	for (var ii = 0; ii < npol;ii++)
	{
		if ((((components[ii].y<=y) && (y<components[jj].y)) || ((components[jj].y<=y) && (y<components[ii].y))) &&
			(x > (components[jj].x - components[ii].x) * (y - components[ii].y) / (components[jj].y - components[ii].y) + components[ii].x))
		{
			c = !c;
		}
		jj = ii;
	}
	return c;
}


function GetControlName(id)
{
	var beta = (location.hostname == "editor-beta.waze.com"?true:false);
	switch(id)
	{
	    case 'mainedit':
	    	return '.full-address-container .full-address';//'.address-edit-input';
		case 'form':
			return beta?".full-address":".full-address"; // .edit-button
		case 'cityname':
			return beta?'class="city-name form-control"':'class="city-name form-control"';
		case 'citynamecheck':
			return beta?".empty-city":".empty-city";
		case 'streetname':
			return beta?'class="form-control street-name tts-input"':'class="form-control street-name tts-input"';
		case 'streetnamecheck':
			return beta?".empty-street":".empty-street";
		case 'housenumber':
			return beta?'class="form-control house-number"':'class="form-control house-number"';
		case 'save':
			return beta?'class="save-button waze-btn waze-btn-blue waze-btn-smaller"':'class="save-button waze-btn waze-btn-blue waze-btn-smaller"';
		case 'cancel':
			return beta?'class="cancel-button waze-btn waze-btn-smaller waze-btn-transparent"':'class="cancel-button waze-btn waze-btn-smaller waze-btn-transparent"';
		case 'name':
			return "name";
	}
	return '';
}


function makeQSPPanel(reciever)
{
    if (wmeQSP_debug) console.debug("makeQSPPanel()",reciever);
	if (document.getElementById("button_"+CreateID())) return ; // кнопки созданы, к терапевту

	// проврка - есть хотя бы одна кнопка
	var cntButton=false;
	for(var i=0; i < wmeQSP_ConfigOrderSegments.length; ++i)
	{
		var prop=wmeQSP_ConfigOrderSegments[i];
		if (typeof wmeQSP_ConfigSegments[prop] !== "undefined" && wmeQSP_ConfigSegments[prop].Interface.Add)
		{
			cntButton=true;
			break;
		}
	}

	if (cntButton) // рисуем "панель", если была выведена хотя бы одна кнопка
	{
		var obj=$("#segment-edit-general"); // в панели редактора...

		var newDiv0=$("<div/>").attr({class:"form-group",id:"button_"+CreateID()}); // ...новая "наша" панель...
		newDiv0.append($('<label class="control-label">QSP:&nbsp;</label>')); // ...название...

		var newDiv=$("<div/>").attr({class:"clearfix controls qsp"}); // ...внутри ещё один div...

		for(let i=0; i < wmeQSP_ConfigOrderSegments.length; ++i) // в цикле в новый div вгоняем кнопки...
		{
			let prop=wmeQSP_ConfigOrderSegments[i];
			if (typeof wmeQSP_ConfigSegments[prop] !== "undefined")
			{
				if (wmeQSP_ConfigSegments[prop].Interface.Add)
				{
					var newButton=$('<input/>').
						attr({type: 'button',id: 'bWmeQSP'+prop,value:wmeQSP_ConfigSegments[prop].Interface.Name}).
						css('background-color',typeof wmeQSP_Colors[prop] !== "undefined"?wmeQSP_Colors[prop].color:"white").
						click(function(e){
							var roadType=parseInt(e.target.id.substr(7));
							WmeQSP_ModifySelectedSegments(roadType,wmeQSP_ConfigSegments[roadType]);
						});
					newDiv.append(newButton);
				}
			}
		}

		newDiv0.append(newDiv);
		obj.before(newDiv0); // добавляем в дерево нашу панель.
	}
}


function CreateObserver(Name,fn)
{
    // проверка изменений в панели edit-panel
    var qspObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Mutation is a NodeList and doesn't support forEach like an array
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];

                // смотрим только узлы
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    var qspDiv = addedNode.querySelector(Name);
                    if (!qspDiv)
                        fn(qspDiv); // создадим свою панель
                }
            }
        });
    });
    qspObserver.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
}

function WmeQSP_Main()
{
	if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_Main()");
	if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_Main(): selectedItems.length=",W.selectionManager.getSelectedFeatures().length);


	if (W.selectionManager.getSelectedFeatures().length > 0)
	{
		// работы по наследованию адресу у ПОИ
		if(wmeQSP_debug) console.log(W.selectionManager.getSelectedFeatures()[0].model.type);
		if(W.selectionManager.getSelectedFeatures()[0].model.type === "venue")
		{
			if (!wmeQSP_cloneAddress)
				return;

			var addAltName  = false;
			var altName     = "";
			var houseNumber = "";
			var streeName   = "";
			var cityName    = "";
			//W.selectionManager.getSelectedFeatures()[0].model.isPoint()

			var x=W.selectionManager.getSelectedFeatures()[0].model.attributes.geometry.x;
			var y=W.selectionManager.getSelectedFeatures()[0].model.attributes.geometry.y;

			for(var i=0; i < W.model.venues.additionalInfo.length; ++i)
			{
				if(wmeQSP_debug) console.log("WME Node (" + i + "): " +(typeof W.model.venues.additionalInfo[i].attributes.geometry.components));
				if (typeof W.model.venues.additionalInfo[i].attributes.geometry.components  != "undefined")
				{
					if (PtInPoly(x,y,W.model.venues.additionalInfo[i].attributes.geometry.components[0].components))
					{
						if(wmeQSP_debug) console.log("WME-QuickSetupProperties: found POI = ",W.model.venues.additionalInfo[i]);

						if (W.selectionManager.getSelectedFeatures()[0].model.attributes.aliases.length === 0)
							addAltName=true;
						altName=W.model.venues.additionalInfo[i].attributes.name;
						houseNumber = W.model.venues.additionalInfo[i].attributes.houseNumber;
						if(typeof houseNumber === "undefined" || !houseNumber)
							houseNumber="";
						streeName   = W.model.streets.objects[W.model.venues.objects[W.model.venues.additionalInfo[i].attributes.id].attributes.streetID].name;
						if(typeof streeName === "undefined" || !streeName)
							streeName="";

						var poi_id=W.model.venues.additionalInfo[i].attributes.id;
						var poi_streetID=W.model.venues.objects[poi_id].attributes.streetID;
						var poi_cityID=W.model.streets.objects[poi_streetID].cityID;
						var poi_cityName=W.model.cities.getObjectById(poi_cityID).attributes.name;
						cityName=poi_cityName;
						if(typeof cityName === "undefined" || !cityName)
							cityName="";
						break;
					}
				}
			}

			if(wmeQSP_debug) console.log("cityName=",cityName,"streeName=",streeName,"houseNumber=",houseNumber,"altName=",altName);

			if(houseNumber !== "" || streeName !== ""|| cityName !== "")
			{
				if(wmeQSP_debug) console.log('WME-QuickSetupProperties: cityName|streeName|houseNumber != ""');

				if(wmeQSP_debug) console.log("кликаем кнопку изменение адреса");
				// кликаем кнопку изменение адреса
				$(GetControlName('form')).click();

				// открылась форма
				setTimeout(function() {
					var res=null;
					var mod=false;

					// ** обработка имени стрита **
					if(streeName && streeName !== "")
					{
						if(wmeQSP_cloneAddressAbs || !$('input['+GetControlName('streetname')+']').val().length)
						{
							if(wmeQSP_debug) console.log("streetname.parent ==>",streeName);
							if(wmeQSP_debug) console.log("streetname.this   ==>",$('input['+GetControlName('streetname')+']').val());
							if(wmeQSP_debug) console.log("streetname.parent !== streeName.this ==> ",$('input['+GetControlName('streetname')+']').val() !== streeName);

							if ($('input['+GetControlName('streetname')+']').val() !== streeName)
							{
								if(wmeQSP_debug) console.log($(GetControlName('streetnamecheck')));
								// если чекед ("без улицы") - сделать uncheck (разлочить строку ввода)
								if ($(GetControlName('streetnamecheck'))[0].checked)
									$(GetControlName('streetnamecheck')).click();

    							{
									// TODO: здесь нужен блок по преобразованию имени стрита к нашему виду.
								}

								// ставить имя стрита в адрес
								$('input['+GetControlName('streetname')+']').val(streeName).change().focusout();
								mod=true;
								if(wmeQSP_debug) console.log("streetname.this.new  ==>",$('input['+GetControlName('streetname')+']').val());
							}
						}
					}

					// ** обработка номера дома **
					if(houseNumber && houseNumber !== "")
					{
						// коррекция букв в номерах домов
						houseNumber=houseNumber.toLowerCase();
						if (houseNumber.indexOf("б") > -1) // "Б" делаем большим
							houseNumber=houseNumber.toUpperCase();


						// выносим номер дома в название (если пусто)
						var nameLength=$('input[name="name"].form-control').length;
						if(nameLength > 1)
						{
							for(var ii=0; ii < nameLength; ++ii)
							{
								if (typeof ($($('input[name="name"].form-control')[ii]).attr("id")) === "undefined" && !$($('input[name="name"].form-control')[ii]).val())
								{
									$($('input[name="name"].form-control')[ii]).val(houseNumber).change().focusout();
									break;
								}
							}
						}
						else
						{
							if(!$('input[name="name"].form-control').val())
								$('input[name="name"].form-control').val(houseNumber).change().focusout();
						}

						// ставить номер дома в адрес
						//if(wmeQSP_cloneAddressAbs || !$('input['+GetControlName('housenumber')+']').val() || $('input['+GetControlName('housenumber')+']').val() != houseNumber)
						if(wmeQSP_cloneAddressAbs || !$('input['+GetControlName('housenumber')+']').val())
						{
							if ($('input['+GetControlName('housenumber')+']').val() != houseNumber)
							{
								$('input['+GetControlName('housenumber')+']').val(houseNumber).change().focusout();
								mod=true;
							}
						}

					}

					// ** обработка имени НП **
					if(cityName && cityName !== "")
					{
						if(wmeQSP_cloneAddressAbs || !$('input['+GetControlName('cityname')+']').val().length)
						{
							if ($('input['+GetControlName('cityname')+']').val() != cityName)
							{
								// если чекед ("без НП") - сделать uncheck (разлочить строку ввода)
								if ($(GetControlName('citynamecheck'))[0].checked)
									$(GetControlName('citynamecheck')).click();

								// ставить имя НП в адрес
								$('input['+GetControlName('cityname')+']').val(cityName).change().focusout();
								mod=true;
							}
						}
					}

					if(wmeQSP_debug) console.log("mod=",mod);
					if(wmeQSP_debug) console.log("button==>",$('button['+(mod ?GetControlName('save'):GetControlName('cancel'))+']'));

					$('button['+(mod ?GetControlName('save'):GetControlName('cancel'))+']').click();

					//if (mod) setTimeout(function(){__reselectItem();}, 60);
					mod=false;
				}, 60);


				// добавляем альтернативное имя - имя родителя
				if (wmeQSP_cloneAddressAbs && altName && altName !== "")
				{
					if(wmeQSP_debug) console.log('set altname',altName);
					if (addAltName)
						$(".aliases-view").find(".add").click();

					setTimeout(function() {
						var v=$(".aliases-view").find(".alias-name.form-control");
						if(wmeQSP_debug) console.log('v',v[v.length-1],$(v[v.length-1]).val());
						$(v[v.length-1]).val(altName).change().focusout();
					},160);
				}

			}
			else
			{
				var HN=$('input['+GetControlName('housenumber')+']');
				if(HN.length)
				{
					document.getElementsByClassName("save-button waze-btn waze-btn-blue waze-btn-smaller")[0].onclick=function(){
						if(wmeQSP_debug) console.log('WME-QuickSetupProperties: start onclick');

						var nval=$('input[name="name"].form-control').val();
						if(!nval || nval.length === 0)
						{
							if(wmeQSP_debug) console.log('WME-QuickSetupProperties: set name as houseNumber');
							$('input[name="name"].form-control').val(HN.val()).change().focusout();
						}
						else
						{
							if(wmeQSP_debug) console.log('WME-QuickSetupProperties: name not change');
						}
					};
				}
			}
		}
		else if(W.selectionManager.getSelectedFeatures()[0].model.type === "segment") // добавим кнопки
		{
			if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_Main(): Insert button ==> ",document.getElementById("button_"+CreateID()));
			if (document.getElementById("button_"+CreateID()))
				return ; // кнопки созданы, к терапевту
			CreateObserver('div.controls.qsp',makeQSPPanel);
			makeQSPPanel();
		}
	}
}

function WmeQSP_ModifySelectedSegments0()
{
	if ((typeof arguments[0]) === "object")
	{
		return WmeQSP_ModifySelectedSegments(arguments[0].roadType,wmeQSP_ConfigSegments[arguments[0].roadType]);
	}
}


function __FindStreetList()
{
	var found = [];

	//1. По списку сегментов ищем наши стриты
	var streetsList = [];
	// берём все сегменты
	var arseg=W.model.segments.getObjectArray();
	if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): arseg.length="+arseg.length);

	for(let i=0; i < arseg.length; ++i)
	{
        if (arseg[i].attributes.primaryStreetID)
        {
            // берём стриты, у них cityID
            var street=W.model.streets.getObjectById(arseg[i].attributes.primaryStreetID);
            //if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): "+i+") "+(typeof street)+" ==> primaryStreetID=" + arseg[i].attributes.primaryStreetID);
            if (street && typeof street != "undefined")
            {
                var coordpt = [];
                for(var ii=0; ii < arseg[i].attributes.geometry.components.length; ++ii)
                    coordpt.push({x:arseg[i].attributes.geometry.components[ii].x,y:arseg[i].attributes.geometry.components[ii].y});

                streetsList.push({cityID:street.cityID, coordpt:coordpt});
            }
        }
	}
    //if (wmeQSP_debug) console.log("0) streetsList=",streetsList);

	// 2. схлопываем однородные города
	streetsList.sort(function(a,b){ return a.cityID - b.cityID; });
	for(let ii=0; ii < streetsList.length-1; ++ii)
	{
        //if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): " + ii+") " + streetsList[ii].cityID +" == "+ streetsList[ii+1].cityID + "    streetsList.length="+streetsList.length);
		if(streetsList[ii].cityID == streetsList[ii+1].cityID)
		{
			streetsList[ii].coordpt=streetsList[ii].coordpt.concat(streetsList[ii+1].coordpt);
			streetsList.splice (ii+1, 1); // delete
			ii=-1;
		}
	}
    //if (wmeQSP_debug) console.log("1) streetsList=",streetsList);

	// 3. сортируем что получилось (Graham's Scan Convex Hull Algorithm)
	for(let ii=0; ii < streetsList.length; ++ii)
	{
        //if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): >>streetsList["+ii+"].coordpt:"+dump(streetsList[ii].coordpt));
		var hull = new ConvexHull();

		hull.compute(streetsList[ii].coordpt);
		var indices = hull.getIndices();
        //if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): indices:", indices);

		if (indices && indices.length>0)
        {
			let coordpt=[];
			for (let jj=0; jj<indices.length; jj++) {
				coordpt.push({x:streetsList[ii].coordpt[indices[jj]].x,y:streetsList[ii].coordpt[indices[jj]].y});
			}
			streetsList[ii].coordpt=coordpt;
		}
		delete hull;
        //		if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): <<streetsList["+ii+"].coordpt:"+dump(streetsList[ii].coordpt));
	}
    //if (wmeQSP_debug) console.log("2) streetsList=",streetsList);


	// 4. проверяем
    //	if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): components.length=" + W.selectionManager.getSelectedFeatures()[0].model.attributes.geometry.components.length);
	for(let ii=0; ii < streetsList.length; ++ii)
	{
        //		if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): "+ii+") cityID="+streetsList[ii].cityID+ " ---------------------" + " selectedItems[0].components.length=" +W.selectionManager.getSelectedFeatures()[0].model.attributes.geometry.components.length);
		for(var jj=0; jj < W.selectionManager.getSelectedFeatures()[0].model.attributes.geometry.components.length; ++jj)
		{
			var comp=W.selectionManager.getSelectedFeatures()[0].model.attributes.geometry.components[jj];
            //if (wmeQSP_debug) console.log("comp=",comp,streetsList[ii].coordpt,PtInPoly(comp.x, comp.y, streetsList[ii].coordpt));
			if(PtInPoly(comp.x, comp.y, streetsList[ii].coordpt))
			{
                //				if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): __FindStreetList(): found");
                //				if(wmeQSP_debug) console.log('W.model.cities.getObjectById(streetsList[ii].cityID).name="'+W.model.cities.getObjectById(streetsList[ii].cityID).attributes.name+'" (typeof='+(typeof W.model.cities.getObjectById(streetsList[ii].cityID).attributes.name)+')');
				if(found.indexOf(streetsList[ii].cityID) < 0 && W.model.cities.getObjectById(streetsList[ii].cityID).attributes.name !== "" && (W.model.cities.getObjectById(streetsList[ii].cityID).attributes.name !== "undefined"))
					found.push(streetsList[ii].cityID);
			}
		}
	}
    if (wmeQSP_debug) console.log("END found=",found);
	return found;
}

function __getDataAround(segment)
{
	let Data={
		emptyCity : true,
		emptyStreet : true,
		countryID: -1,
		stateID: -1,
		cityName: null,
		streetName: null,
	};

	if (!wmeQSP_AI_On) // ИИ на распознавание НП выключен?
	{
		if (wmeQSP_CityName.length > 0)
		{
		    Data.cityName=wmeQSP_CityName;
		    Data.emptyCity=false;

		    let astateID=W.model.cities.getObjectArray().map(function(i){return i.attributes.name === wmeQSP_CityName?i.attributes.stateID:-1;}).filter(function(i){return i != -1;});
		    if (astateID.length)
		    {
				Data.stateID=astateID[0];
			}
		}
		return Data;
	}

    let countries=W.model.countries.getObjectArray();
    if (countries.length > 1)
    {
		Data.countryID=[]; // формируем массив ID
		for(let i=0; i < countries.length; ++i)
		{
			Data.countryID.push(countries[i].id);
		}
    }
    else
    {
        Data.countryID=countries[0].id;
    }

	var found=__FindStreetList();
	var cntCFound=found.length;
	if(found.length === 1) // найден 1
	{
		Data.stateID=W.model.cities.getObjectById(found[0]).attributes.stateID;
	    Data.cityName=W.model.cities.getObjectById(found[0]).attributes.name;
	    Data.emptyCity=false;
	}
	else if(found.length) // много
	{
		cntCFound=found.length;
        Data.emptyCity=false;
		Data.cityName=[]; // формируем массив ID
		for(let i=0; i < found.length; ++i)
		{
			Data.cityName.push(found[i]);
		}
	}

	if(!found.length) // смотрим район только, если имя НП пустое.
	{
		var statesList=W.model.states.getObjectArray();
        console.log("statesList=",statesList);
		if (statesList.length === 1)
		{
			Data.stateID=statesList[0].id;
		}
		else
		{
			Data.stateID=[]; // формируем массив ID
            for(let i=0; i < statesList.length; ++i)
            {
                Data.stateID.push(statesList[i]);
            }
		}
	}

	return Data;
}


function WmeQSP_ModifySelectedSegments(roadType,arg)
{
	if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_ModifySelectedSegments()", arg);

	if (W.selectionManager.getSelectedFeatures()[0].model.type !== "segment")
	{
		if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_ModifySelectedSegments(): no segment!!! ==> typeObject="+W.selectionManager.getSelectedFeatures()[0].model.type + ". stop" );
		return;
	}

	// все выделнные сегменты
    var segments = (W.selectionManager.getSelectedFeatures().map((s) => s.model)).filter((el) => el.isGeometryEditable());

    for(let idxseg=0; idxseg < segments.length; ++idxseg)
    {
        let segment = segments[idxseg];
        let addr=__getDataAround(segment);
        let foundControversialSituation = (addr.cityName != null && typeof addr.cityName === "object")?true:false; // их много?
		let attributes = {
			fwdMaxSpeed: null,
			revMaxSpeed: null,
			fwdMaxSpeedUnverified: false,
			revMaxSpeedUnverified: false,
			roadType: roadType,
			lockRank: -1
		};

		// ставим скорости
		if (addr.emptyCity)
		{
			if ((typeof (arg.speedOut.fwdMaxSpeed)) !== "undefined")
			{
				attributes.fwdMaxSpeed=parseInt(arg.speedOut.fwdMaxSpeed);
			}
			if ((typeof (arg.speedOut.revMaxSpeed)) !== "undefined")
			{
				attributes.revMaxSpeed=parseInt(arg.speedOut.revMaxSpeed);
			}
		}
		else
		{
			if ((typeof (arg.speedIn.fwdMaxSpeed)) !== "undefined")
			{
				attributes.fwdMaxSpeed=parseInt(arg.speedIn.fwdMaxSpeed);
			}
			if ((typeof (arg.speedIn.revMaxSpeed)) !== "undefined")
			{
				attributes.revMaxSpeed=parseInt(arg.speedIn.revMaxSpeed);
			}
		}

		// чем лочим
		attributes.lockRank=addr.emptyCity?arg.Lock.Out:arg.Lock.In;

		// эти изменения для сохранения
		W.model.actionManager.add(new WazeActionUpdateObject(segment,attributes));

        // ЖД однозначно без имени и фамилии
		if (roadType == 18)
		{
			addr.emptyCity = true;
			addr.emptyStreet = true;
			addr.cityName = null;
			addr.streetName = null;
		}

        function __IsObject(o)
        {
            return o != null && typeof o === "object";
        }

        if (roadType != 18 &&  (__IsObject(addr.cityName) || __IsObject(addr.stateID) || __IsObject(addr.countryID) || arg.needName.In || arg.needName.Out)) // несколько ИЛИ всегда стрит пустышкой ставить И не ЖД?
		{
            // тут руками надо поработать

			$(GetControlName('mainedit')).click();

            if(!__IsObject(addr.countryID))
            {
                $(".country-id").val(addr.countryID).change().focusout();
            }

            if(!__IsObject(addr.stateID))
            {
                $(".state-id").val(addr.stateID).change().focusout();
            }


			if (addr.emptyCity && !$("#empty-city")[0].checked)
			{
                console.log("== 1 ==");
				$("#empty-city").click();
			}
            console.log("addr.emptyCity=",addr.emptyCity,"addr.emptyStreet=",addr.emptyStreet,"arg.needName=",arg.needName)
			if (!$("#empty-street")[0].checked && !((!addr.emptyCity && arg.needName.In) || (addr.emptyCity && arg.needName.Out))) //???
			{
                console.log("== 2 ==");
				$("#empty-street").click();
			}
			if(segment.attributes.id < 0 && $("#empty-street")[0].checked && ((!addr.emptyCity && arg.needName.In) || (addr.emptyCity && arg.needName.Out)))
			{
                console.log("== 3 ==");
				$("#empty-street").click();
			}

			if(__IsObject(addr.cityName))
			{
                console.log("addr.cityName=",addr.cityName,"typeof addr.cityName=",(typeof addr.cityName));
				$('.city-name').val("").change().focusout();
				let d=document.getElementById("WME.QuickSetupPropertiesCitiesList");
				if(!d)
				{
					d=document.createElement('div');
					d.setAttribute('id', 'WME.QuickSetupPropertiesCitiesList');
					var inp = document.getElementsByClassName("city-name");
					inp[0].parentNode.appendChild(d);
					d=document.getElementById("WME.QuickSetupPropertiesCitiesList");

					let msgHTML="";
					for(let i=0; i < addr.cityName.length; ++i)
					{
						var ss='<a id="cityID_' + addr.cityName[i] + '">' + W.model.cities.getObjectById(addr.cityName[i]).attributes.name + '</a></br>';
						msgHTML+=ss;
					}
					d.innerHTML=msgHTML;
					if (wmeQSP_debug) console.log("msg=",msgHTML);
					for(let i=0; i < addr.cityName.length; ++i)
					{
						document.getElementById('cityID_'+i).onclick = (function onclickCityName()
						  {
							//if (wmeQSP_debug) console.log("this.id.substr(7)="+this.id.substr(7));
							//if (wmeQSP_debug) console.log("W.model.cities.getObjectById(this.id.substr(7)).attributes.name="+W.model.cities.getObjectById(this.id.substr(7)).attributes.name);
							//if (wmeQSP_debug) console.log("this.id.substr(7)).attributes.stateID="+W.model.cities.getObjectById(this.id.substr(7)).attributes.stateID);
							$('.city-name').val(W.model.cities.getObjectById(this.id.substr(7)).attributes.name).change().focusout();
							$(".state-id").val(W.model.cities.getObjectById(this.id.substr(7)).attributes.stateID).change().focusout();
							$(".save-button").click();
						  });
					}

					var msg="Выделенный сегмент принадлежит следующим НП:\n\n";
					for(let i=0; i < found.length; ++i)
					{
						msg+=(i+1) +") " + W.model.cities.getObjectById(found[i]).attributes.name + " (CityID="+found[i]+")\n";
					}
					msg+="\nВведите имя НП вручную.";
					alert(msg);
				}
			}
			else // он один, но требуется ввод
			{
				$('.city-name').val(addr.cityName).change().focusout();
				$('.street-name').focus()
			}


            if(__IsObject(addr.cityName) && !__IsObject(addr.stateID) && !__IsObject(addr.countryID))
            {
				$('.city-name').focus();
            }

		}
		else // найден однозначный город, данные под сохранение
		{
            console.log("segment=",segment)
            console.log("addr=",addr)
			W.model.actionManager.add(new WazeActionUpdateFeatureAddress(segment,addr,{streetIDField: 'primaryStreetID'}));
		}

        // ******************************
        if(foundControversialSituation)
            break; // тормозим процесс
    }
    if (wmeQSP_debug) console.log("-= end WmeQSP_ModifySelectedSegments =-");
};


function WmeQSP_ChangeLevel()
{
	if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_ChangeLevel()");
	if (!W.selectionManager.hasSelectedItems() || W.selectionManager.getSelectedFeatures()[0].model.type !== "segment")
	{
		return;
	}
	if ((typeof arguments[0]) === "object")
	{
		$('select[name="level"]').val(arguments[0].level).change().focusout();
		return true;
	}
}


function WmeQSP_ModifySelectedNode()
{
	if (wmeQSP_debug) console.log("WME-QuickSetupProperties (" + wmeQSP_version + "): WmeQSP_ModifySelectedNode()");
	//if (wmeQSP_debug) console.dir(W.accelerators.Actions.WMEShiftSelectedNode);
	var selectionManager = W.selectionManager;
	if (!selectionManager.hasSelectedItems() || selectionManager.selectedItems[0].model.type !== "node")
	{
		return;
	}

	var node2 = W.selectionManager.getSelectedFeatures()[0];
	var model = node2.model;
	var proc=true;
	var origSegGeometries = {}; // массив объектов!

	for(var i=0; i < model.attributes.segIDs.length; ++i)
	{
		var iseg=model.attributes.segIDs[i];

		var lockRank=W.model.segments.objects[iseg].attributes.lockRank;

		origSegGeometries[iseg]=W.model.segments.objects[iseg].geometry;

		if(lockRank && (lockRank+1) > W.loginManager.user.normalizedLevel)
		{
			proc=false;
			break;
		}
	}


	if (proc)
	{
		var node = W.model.nodes.getObjectById(model.attributes.id);
		var nodeGeo = node.geometry.clone();
		if ((Math.random()*10) & 1)
			nodeGeo.x+=((Math.random()*10) & 1 ?+0.00001:-0.00001);
		else
			nodeGeo.y+=((Math.random()*10) & 1 ?+0.00001:-0.00001);
		nodeGeo.calculateBounds();

		var MoveNode = require("Waze/Action/MoveNode");
		W.model.actionManager.add(new MoveNode(node, node.geometry, nodeGeo, origSegGeometries, 0));
		delete nodeGeo;
	}
};


function __GetLocalStorageItem(Name,Type,Def,Arr)
{
	//if (wme2GIS_debug) console.log("__GetLocalStorageItem(): Name="+Name+",Type="+Type+",Def="+Def+",Arr="+Arr);
	var tmp0=localStorage.getItem(Name);
	if (tmp0)
	{
		switch(Type)
		{
			case 'string':
				break;
			case 'bool':
				tmp0=(tmp0 === "true" || tmp0 === "1")?true:false;
				break;
			case 'int':
				tmp0=!isNaN(parseInt(tmp0))?parseInt(tmp0):0;
				break;
			case 'arr':
				if (tmp0.length > 0)
					if(!Arr[tmp0])
						tmp0=Def;
				break;
		}
	}
	else
		tmp0=Def;
	return tmp0;
}

function WmeQSP_InitConfig()
{
	if (wmeQSP_debug) console.log("WmeQSP_InitConfig()",CreateID(),document.getElementById(CreateID()));
	if(!document.getElementById(CreateID()))
	{
		var road_types=I18n.translations[I18n.locale].segment.road_types;

		var srsCtrl = document.createElement('section');
		srsCtrl.id = CreateID();

	    var userTabs = document.getElementById('user-info');
	    if (typeof userTabs !== "undefined")
	    {
    		var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    		if (typeof navTabs !== "undefined")
    		{
	    		var tabContent = getElementsByClassName('tab-content', userTabs)[0];
	    		if (typeof tabContent !== "undefined")
		    	{
					let newtab = document.createElement('li');
					// fa ==> http://fontawesome.io/cheatsheet/
					newtab.innerHTML = '<a href="#' + CreateID() + '" id="pwmeQSP" data-toggle="tab" class="fa fa-vcard-o">&nbsp;QSP</a>';
					navTabs.appendChild(newtab);

					//srsCtrl.id = "sidepanel-???";
					srsCtrl.className = "tab-pane";

					var padding="padding:5px 9px";

					// ------------------------------------------------------------
					var src = ''
						+'<div class="side-panel-section">'
						+'<h4>WME-QuickSetupProperties <sup>' + wmeQSP_version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/ru/scripts/19984-wme-quicksetupproperties" title="Link" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'
						+'<form class="attributes-form side-panel-section" action="javascript:return false;">'

						+'<div class="form-group">'
						+'<label class="control-label">Имя НП:</label>'
						+'<div class="controls">'
                        +'<input name="wmeqsp_cfg_AI_On" value="" id="wmeqsp_cfg_AI_On" type="checkbox"><label for="wmeqsp_cfg_AI_On" title="Включить ИИ на распознавание НП">&nbsp;Распознать имя НП</label>'
						+'<input type="text" class="form-control" autocomplete="off" id="wmejm_cfg_cityname" name="wmejm_cfg_cityname" value="'+wmeQSP_CityName+'"/></label><br>'
						+'</div>'
						+'</div>'
						+'';

					src += ''
						+'<div class="form-group">'
						+'<label class="control-label">Параметры сегментов по типам:</label>'
						+'<div class="controls">';

						for(var i=0; i < wmeQSP_ConfigOrderSegments.length; ++i)
						{
							var prop=wmeQSP_ConfigOrderSegments[i];
							src += ''
								+'<div class="form-group" style="background-color:'+(typeof wmeQSP_Colors[prop] !== "undefined"?wmeQSP_Colors[prop].color:"#fafafa;")+'">'
								+'<label class="control-label">'
								+'<span class="fa fa-minus-square-o" id="wmeqspcaret_'+prop+'"></span> <a style="cursor: pointer; display: inline;" class="__wmeqsp_cfg_editlab__" data="'+prop+'"><label id="wmeqsp_cfg_'+prop+'_chklab" for="wmeqsp_cfg_'+prop+'">'+road_types[prop]+'</label>'
								+'</label></a>'
								+'<div class="controls" id="wmeqsp_inp_'+prop+'_all" style="display: block;">';

							src+=''
								+'<div class="form-group"  style="background-color:'+(typeof wmeQSP_Colors[prop] !== "undefined"?wmeQSP_Colors[prop].color:"#fafafa;")+'">' // style="background: #fafafa;"

								+'<div class="form-group">'
								+'<div class="controls">'
        		                //+'<input data="'+prop+'" name="wmeqsp_cfg_'+prop+'_interfaceAdd" value="" id="wmeqsp_cfg_'+prop+'_interfaceAdd" type="checkbox"><label for="wmeqsp_cfg_'+prop+'_interfaceAdd" title="Добавить кнопку действия">&nbsp;Добавить кнопку</label>'
								//+'<input data="'+prop+'" type="text" class="form-control" autocomplete="off" id="wmeqsp_cfg_'+prop+'_interfaceName" name="wmeqsp_cfg_'+prop+'_interfaceName" value=""/></label><br>'
                                +'<table boder="0" width="100%"><tr>'
                                +'<td><input data="'+prop+'" name="wmeqsp_cfg_'+prop+'_interfaceAdd" value="" id="wmeqsp_cfg_'+prop+'_interfaceAdd" type="checkbox"><label for="wmeqsp_cfg_'+prop+'_interfaceAdd" title="Добавить кнопку действия">&nbsp;Кнопка</label></td>'
                                +'<td width="40%"><input data="'+prop+'" type="text" class="form-control" autocomplete="off" id="wmeqsp_cfg_'+prop+'_interfaceName" name="wmeqsp_cfg_'+prop+'_interfaceName" value=""/></label></td>'
								+'</tr></table></br>'
								+'</div>'

								+'<label>В населённом пункте:</label></br>'
                                +'<input data="'+prop+'" name="wmeqsp_cfg_'+prop+'_needIName" value="" id="wmeqsp_cfg_'+prop+'_needIName" type="checkbox"><label for="wmeqsp_cfg_'+prop+'_needIName" title="Для нового сегмента требовать ввод имени">&nbsp;Требовать имя сегмента</label>'
								+'<table boder="0"><tr>'
								+'<td>Скорость A → B (км/ч)</td>'
								+'<td width="40%"><input data="'+prop+'" class="form-control" id="wmeqsp_cfg_'+prop+'_valIF" name="wmeqsp_cfg_'+prop+'_valIF" maxlength="4" value="" data-type="numeric" data-nullable="true" data-units="km" type="number"></td>'
								+'</tr><tr>'
								+'<td>Скорость B → A (км/ч)</td>'
								+'<td width="40%"><input data="'+prop+'" class="form-control" id="wmeqsp_cfg_'+prop+'_valIB" name="wmeqsp_cfg_'+prop+'_valIB" maxlength="4" value="" data-type="numeric" data-nullable="true" data-units="km" type="number"></td>'
								+'</tr><tr>'
        		                +'<td>Блокировка</td>'
                		        +'<td width="40%">'
                        		+'<select class="form-control" data="'+prop+'" data-type="numeric" id="wmeqsp_cfg_'+prop+'_lockIn" title="Уровень блокировки изменяемых сегментов в НП" ><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option></select>'
		                        +'</td>'
								+'</tr></table>'
								+'</div>'

								+'<div class="form-group">'
								+'<label>Вне населённого пункта:</label></br>'
                                +'<input data="'+prop+'" name="wmeqsp_cfg_'+prop+'_needOName" value="" id="wmeqsp_cfg_'+prop+'_needOName" type="checkbox"><label for="wmeqsp_cfg_'+prop+'_needOName" title="Для нового сегмента требовать ввод имени">&nbsp;Требовать имя сегмента</label>'
								+'<table boder="0"><tr>'
								+'<td>Скорость A → B (км/ч)</td>'
								+'<td width="40%"><input data="'+prop+'" class="form-control" id="wmeqsp_cfg_'+prop+'_valOF" name="wmeqsp_cfg_'+prop+'_valOF" maxlength="4" value="" data-type="numeric" data-nullable="true" data-units="km" type="number"></td>'
								+'</tr><tr>'
								+'<td>Скорость B → A (км/ч)</td>'
								+'<td width="40%"><input data="'+prop+'" class="form-control" id="wmeqsp_cfg_'+prop+'_valOB" name="wmeqsp_cfg_'+prop+'_valOB" maxlength="4" value="" data-type="numeric" data-nullable="true" data-units="km" type="number"></td>'
								+'</tr><tr>'
        		                +'<td>Блокировка</td>'
                		        +'<td width="40%">'
                        		+'<select class="form-control" data="'+prop+'" data-type="numeric" id="wmeqsp_cfg_'+prop+'_lockOut" title="Уровень блокировки изменяемых сегментов вне НП" ><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option></select>'
		                        +'</td>'
								+'</tr></table>'
								+'</div>'

								+'</div>'
								+'';

							src += ''
								+'</div>'
								+'</div>'
								+'';

						}


					src += ''
						+'</div>'
						+'</div>'
						+'';


					src += ''
						+'<div class="controls">'
						+'<label class="control-label">Дополнительные настройки</label>'
						+'<div class="controls">'
						+'<input name="wmeqsp_cfg_cloneaddress" value="" id="wmeqsp_cfg_cloneaddress" type="checkbox"><label for="wmeqsp_cfg_cloneaddress" title="Для вложенного ПОИ наследовать адрес родительского ПОИ, так же выключает обработку ПОИ">&nbsp;Клонировать адрес</label><br>'
						+'&nbsp;<input name="wmeqsp_cfg_cloneaddressabs" value="" id="wmeqsp_cfg_cloneaddressabs" type="checkbox"><label for="wmeqsp_cfg_cloneaddressabs" title="Всегда наследовать адрес">&nbsp;Всегда клонировать адрес</label>'
						+'</div>'
						+'<div class="controls">'
						+'<input name="wmeqsp_cfg_debug" value="" id="wmeqsp_cfg_debug" type="checkbox"><label for="wmeqsp_cfg_debug" title="Включить логирование">&nbsp;Debug script</label>'
						+'</div>'
						+'<div class="controls">'
						+'<button id="wmeqsp_cfg_hotkey" class="btn btn-default" style="font-size:9px;padding:5px 9px" title="Set hotkey"><i class="fa fa-keyboard-o"></i>&nbsp;Назначить клавиши</button>'
						+'</div>'
						+'</div>'

						+'</form>'
						+'</div>'
						+'';

					// ------------------------------------------------------------
					srsCtrl.innerHTML = src;
					tabContent.appendChild(srsCtrl);
				}
				else
				{
					if (wmeQSP_debug) console.log("typeof tabContent === undefined");
					srsCtrl.id='';
				}
			}
			else
			{
				if (wmeQSP_debug) console.log("typeof navTabs === undefined");
				srsCtrl.id='';
			}
		}
		else
		{
			if (wmeQSP_debug) console.log("typeof userTabs === undefined");
			srsCtrl.id='';
		}

		if(srsCtrl.id !== '')
		{
			document.getElementById("wmeqsp_cfg_debug").onclick = function(){wmeQSP_debug=this.checked;localStorage.setItem("wmeQSP_debug",wmeQSP_debug?"1":"0");};
			document.getElementById("wmeqsp_cfg_debug").checked = wmeQSP_debug;

			document.getElementById("wmeqsp_cfg_AI_On").onclick = function(){
				wmeQSP_AI_On=this.checked;localStorage.setItem("wmeQSP_AI_On",wmeQSP_AI_On?"1":"0");
				document.getElementById("wmejm_cfg_cityname").disabled=this.checked;
			};
			document.getElementById("wmeqsp_cfg_AI_On").checked = wmeQSP_AI_On;


			document.getElementById("wmeqsp_cfg_cloneaddress").onclick = function(){wmeQSP_cloneAddress=this.checked;localStorage.setItem("wmeQSP_cloneAddress",wmeQSP_cloneAddress?"1":"0");};
			document.getElementById("wmeqsp_cfg_cloneaddress").checked = wmeQSP_cloneAddress;

			document.getElementById("wmeqsp_cfg_cloneaddressabs").onclick = function(){wmeQSP_cloneAddressAbs=this.checked;localStorage.setItem("wmeQSP_cloneAddressAbs",wmeQSP_cloneAddressAbs?"1":"0");};
			document.getElementById("wmeqsp_cfg_cloneaddressabs").checked = wmeQSP_cloneAddressAbs;

			document.getElementById("wmejm_cfg_cityname").disabled=document.getElementById("wmeqsp_cfg_AI_On").checked;
			document.getElementById("wmejm_cfg_cityname").onchange = function(){
				wmeQSP_CityName=this.value;
				localStorage.setItem('wmeQSP_CityName', wmeQSP_CityName);
			};

			document.getElementById("wmeqsp_cfg_hotkey").onclick = function(){
				// открываем диалог хоткеев
				$("#links").find("a").last().click();
				// скроллим до нашего блока
				setTimeout(function() {
					$(".modal-body").scrollTop(0).scrollTop($(".shortcut-action-group").find("h2").map(function(indx, element){return (this.innerText === 'WME-QuickSetupProperties')?element:null;}).offset().top-107);
				}, 700);
				return false;
			};

			// обработка видимости
			var __wmeqsp_cfg_editlab__=document.getElementsByClassName("__wmeqsp_cfg_editlab__");
			//if(wmeQSP_debug) console.log("__wmeqsp_cfg_editlab__",__wmeqsp_cfg_editlab__);
			for(let i=0; i < __wmeqsp_cfg_editlab__.length; ++i)
			{
				//if(wmeQSP_debug) console.log("__wmeqsp_cfg_editlab__[i]=",__wmeqsp_cfg_editlab__[i]);
				__wmeqsp_cfg_editlab__[i].onclick= function(){
					var id=this.getAttribute('data');
					var dstyle=document.getElementById("wmeqsp_inp_"+id+"_all").style.display;
					document.getElementById("wmeqsp_inp_"+id+"_all").style.display=(dstyle=="block")?"none":"block";
					// переключалка уголка
					document.getElementById("wmeqspcaret_"+id).setAttribute("class",dstyle=="block"?"fa fa-plus-square-o":"fa fa-minus-square-o");
				};
			}

			for(let i=0; i < wmeQSP_ConfigOrderSegments.length; ++i)
			{
				let prop=wmeQSP_ConfigOrderSegments[i];
				//if(wmeQSP_debug) console.log("sets",prop,road_types[prop]);
				if (wmeQSP_ConfigSegments[prop])
				{
					if (wmeQSP_ConfigSegments[prop].hasOwnProperty("Interface"))
					{
						document.getElementById("wmeqsp_cfg_"+prop+"_interfaceAdd").checked = wmeQSP_ConfigSegments[prop].Interface.Add;
						document.getElementById("wmeqsp_cfg_"+prop+"_interfaceName").value = typeof wmeQSP_ConfigSegments[prop].Interface.Name==="undefined"?"":wmeQSP_ConfigSegments[prop].Interface.Name;
					}
					if (wmeQSP_ConfigSegments[prop].hasOwnProperty("Lock"))
					{
						document.getElementById("wmeqsp_cfg_"+prop+"_lockIn").selectedIndex =  wmeQSP_ConfigSegments[prop].Lock.In;
						document.getElementById("wmeqsp_cfg_"+prop+"_lockOut").selectedIndex = wmeQSP_ConfigSegments[prop].Lock.Out;
					}
					if (wmeQSP_ConfigSegments[prop].hasOwnProperty("needName"))
					{
                        document.getElementById("wmeqsp_cfg_"+prop+"_needIName").checked = wmeQSP_ConfigSegments[prop].needName.In;
						document.getElementById("wmeqsp_cfg_"+prop+"_needOName").checked = wmeQSP_ConfigSegments[prop].needName.Out;
					}
					if (wmeQSP_ConfigSegments[prop].hasOwnProperty("speedIn"))
					{
						document.getElementById("wmeqsp_cfg_"+prop+"_valIF").value = wmeQSP_ConfigSegments[prop].speedIn.fwdMaxSpeed;
						document.getElementById("wmeqsp_cfg_"+prop+"_valIB").value = wmeQSP_ConfigSegments[prop].speedIn.revMaxSpeed;
					}
					if (wmeQSP_ConfigSegments[prop].hasOwnProperty("speedOut"))
					{
						document.getElementById("wmeqsp_cfg_"+prop+"_valOF").value = wmeQSP_ConfigSegments[prop].speedOut.fwdMaxSpeed;
						document.getElementById("wmeqsp_cfg_"+prop+"_valOB").value = wmeQSP_ConfigSegments[prop].speedOut.revMaxSpeed;
					}
				}

				document.getElementById("wmeqsp_cfg_"+prop+"_interfaceAdd").onclick = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].Interface.Add=this.checked;
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};
				document.getElementById("wmeqsp_cfg_"+prop+"_needIName").onclick = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].needName.In=this.checked;
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};
				document.getElementById("wmeqsp_cfg_"+prop+"_needOName").onclick = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].needName.Out=this.checked;
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};
				document.getElementById("wmeqsp_cfg_"+prop+"_interfaceName").onchange = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].Interface.Name=this.value;
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};

    	        document.getElementById("wmeqsp_cfg_"+prop+"_lockIn").onchange = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].Lock.In=parseInt(this.value);
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
    	        };

    	        document.getElementById("wmeqsp_cfg_"+prop+"_lockOut").onchange = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].Lock.Out=parseInt(this.value);
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
    	        };

				document.getElementById("wmeqsp_cfg_"+prop+"_valIF").onchange = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].speedIn.fwdMaxSpeed=parseInt(this.value);
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};
				document.getElementById("wmeqsp_cfg_"+prop+"_valIB").onchange = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].speedIn.revMaxSpeed=parseInt(this.value);
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};
				document.getElementById("wmeqsp_cfg_"+prop+"_valOF").onchange = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].speedOut.fwdMaxSpeed=parseInt(this.value);
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};
				document.getElementById("wmeqsp_cfg_"+prop+"_valOB").onchange = function(){
					var prop=this.getAttribute('data');
					wmeQSP_ConfigSegments[prop].speedOut.revMaxSpeed=parseInt(this.value);
					if(wmeQSP_debug) console.log(prop,wmeQSP_ConfigSegments[prop]);
					localStorage.setItem('wmeQSP_ConfigSegments', WmeSQP_ConfigSpeed2String());
				};
			}

		}
		else
		{
			setTimeout(WmeQSP_InitConfig, 600);
		}

	}
}

function WmeSQP_ConfigSpeed2String()
{
	// exclude private
	var jsn={};
	for(var i in wmeQSP_ConfigSegments)
	{
		jsn[i]=wmeQSP_ConfigSegments[i];
	}
	return JSON.stringify(jsn);
}

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}


//*******************************************************//
// hack for require
(function() {
	if(typeof WMEAPI !== "undefined") {console.log("Found WMEAPI!");return;}
	function patch() {if(typeof require !== "undefined") return; var WMEAPI={};for(WMEAPI.scripts=document.getElementsByTagName("script"),WMEAPI.url=null,i=0;i<WMEAPI.scripts.length;i++)if(WMEAPI.scripts[i].src.indexOf("/assets-editor/js/app")!=-1){WMEAPI.url=WMEAPI.scripts[i].src;break}if(null==WMEAPI.url)throw new Error("WME Hack: can't detect WME main JS");WMEAPI.require=function(a){return WMEAPI.require.define.modules.hasOwnProperty(a)?WMEAPI.require.define.modules[a]:(console.error("Require failed on "+a,WMEAPI.require.define.modules),null)},WMEAPI.require.define=function(a){0==WMEAPI.require.define.hasOwnProperty("modules")&&(WMEAPI.require.define.modules={});for(var b in a)WMEAPI.require.define.modules[b]=a[b]},WMEAPI.tmp=window.webpackJsonp,WMEAPI.t=function(a){if(WMEAPI.s[a])return WMEAPI.s[a].exports;var b=WMEAPI.s[a]={exports:{},id:a,loaded:!1};return WMEAPI.e[a].call(b.exports,b,b.exports,WMEAPI.t),b.loaded=!0,b.exports},WMEAPI.e=[],window.webpackJsonp=function(a,b){for(var d,e,c={},f=0,g=[];f<a.length;f++)e=a[f],WMEAPI.r[e]&&g.push.apply(g,WMEAPI.r[e]),WMEAPI.r[e]=0;var i,j,h=0;for(d in b)WMEAPI.e[d]=b[d],j=b[d].toString(),i=j.match(/CLASS_NAME:\"([^\"]*)\"/),i?c[i[1].replace(/\./g,"/").replace(/^W\//,"Waze/")]={index:d,func:WMEAPI.e[d]}:(c["Waze/Unknown/"+h]={index:d,func:WMEAPI.e[d]},h++);for(;g.length;)g.shift().call(null,WMEAPI.t);WMEAPI.s[0]=0;var l,k={};h=0;for(d in b)if(j=b[d].toString(),i=j.match(/CLASS_NAME:\"([^\"]*)\"/))k={},l=i[1].replace(/\./g,"/").replace(/^W\//,"Waze/"),k[l]=WMEAPI.t(c[l].index),WMEAPI.require.define(k);else{var m=j.match(/SEGMENT:"segment",/);m&&(k={},l="Waze/Model/ObjectType",k[l]=WMEAPI.t(c["Waze/Unknown/"+h].index),WMEAPI.require.define(k)),h++}window.webpackJsonp=WMEAPI.tmp,window.require=WMEAPI.require},WMEAPI.s={},WMEAPI.r={0:0},WMEAPI.WMEHACK_Injected_script=document.createElement("script"),WMEAPI.WMEHACK_Injected_script.setAttribute("type","application/javascript"),WMEAPI.WMEHACK_Injected_script.src=WMEAPI.url,document.body.appendChild(WMEAPI.WMEHACK_Injected_script);window.WMEAPI=WMEAPI;}
	var RPscript = document.createElement("script");
	RPscript.textContent =  patch.toString() + ';\n' + 'patch();';
	RPscript.setAttribute("type", "application/javascript");
	document.body.appendChild(RPscript);
}.call(this));

//*******************************************************//

WmeQSP_bootstrap();

/* ********************************************************** */
// from:
ConvexHullPoint=function(t,i,s){this.index=t,this.angle=i,this.distance=s,this.compare=function(t){return this.angle<t.angle?-1:this.angle>t.angle?1:this.distance<t.distance?-1:this.distance>t.distance?1:0}},ConvexHull=function(){this.points=null,this.indices=null,this.getIndices=function(){return this.indices},this.clear=function(){this.indices=null,this.points=null},this.ccw=function(t,i,s){return(this.points[i].x-this.points[t].x)*(this.points[s].y-this.points[t].y)-(this.points[i].y-this.points[t].y)*(this.points[s].x-this.points[t].x)},this.angle=function(t,i){return Math.atan((this.points[i].y-this.points[t].y)/(this.points[i].x-this.points[t].x))},this.distance=function(t,i){return(this.points[i].x-this.points[t].x)*(this.points[i].x-this.points[t].x)+(this.points[i].y-this.points[t].y)*(this.points[i].y-this.points[t].y)},this.compute=function(t){if(this.indices=null,!(t.length<3)){this.points=t;for(var i=0,s=1;s<this.points.length;s++)this.points[s].y==this.points[i].y?this.points[s].x<this.points[i].x&&(i=s):this.points[s].y<this.points[i].y&&(i=s);var n=new Array,h=0,o=0;for(s=0;s<this.points.length;s++)s!=i&&(h=this.angle(i,s),0>h&&(h+=Math.PI),o=this.distance(i,s),n.push(new ConvexHullPoint(s,h,o)));n.sort(function(t,i){return t.compare(i)});var e=new Array(this.points.length+1),p=2;for(s=0;s<this.points.length;s++)s!=i&&(e[p]=n[p-2].index,p++);e[0]=e[this.points.length],e[1]=i;var c,r=2;for(s=3;s<=this.points.length;s++){for(;this.ccw(e[r-1],e[r],e[s])<=0;)r--;r++,c=e[s],e[s]=e[r],e[r]=c}for(this.indices=new Array(r),s=0;r>s;s++)this.indices[s]=e[s+1]}}};

// from: https://greasyfork.org/ru/scripts/16071-wme-keyboard-shortcuts (modify)
/*
when adding shortcuts each shortcut will need a uniuque name
the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
	ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
	ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
	ShortcutsHeader: this is the header that will show up in the keyboard editor
	NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
	ShortcutDescription: This wil show up as the text next to your shortcut
	FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
	ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
	ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
*/
function WMEKSRegisterKeyboardShortcut(a,b,c,d,e,f,g){try{I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members.length}catch(c){W.accelerators.Groups[a]=[],W.accelerators.Groups[a].members=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a]=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].description=b,I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members=[]}if(e&&"function"==typeof e){I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members[c]=d,W.accelerators.addAction(c,{group:a});var i="-1",j={};j[i]=c,W.accelerators._registerShortcuts(j),null!==f&&(j={},j[f]=c,W.accelerators._registerShortcuts(j)),W.accelerators.events.register(c,null,function(){e(g)})}else alert("The function "+e+" has not been declared")}function WMEKSLoadKeyboardShortcuts(a){if(console.log("WMEKSLoadKeyboardShortcuts("+a+")"),localStorage[a+"KBS"])for(var b=JSON.parse(localStorage[a+"KBS"]),c=0;c<b.length;c++)try{W.accelerators._registerShortcuts(b[c])}catch(a){console.log(a)}}function WMEKSSaveKeyboardShortcuts(a){console.log("WMEKSSaveKeyboardShortcuts("+a+")");var b=[];for(var c in W.accelerators.Actions){var d="";if(W.accelerators.Actions[c].group==a){W.accelerators.Actions[c].shortcut?(W.accelerators.Actions[c].shortcut.altKey===!0&&(d+="A"),W.accelerators.Actions[c].shortcut.shiftKey===!0&&(d+="S"),W.accelerators.Actions[c].shortcut.ctrlKey===!0&&(d+="C"),""!==d&&(d+="+"),W.accelerators.Actions[c].shortcut.keyCode&&(d+=W.accelerators.Actions[c].shortcut.keyCode)):d="-1";var e={};e[d]=W.accelerators.Actions[c].id,b[b.length]=e}}localStorage[a+"KBS"]=JSON.stringify(b)}
/* ********************************************************** */
