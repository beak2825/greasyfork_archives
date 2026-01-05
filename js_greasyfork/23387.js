// ==UserScript==
// @name        WME Make EntryExit
// @description Оформить сегмент на выезд/выезд для парковки, двора и АЗС
// @namespace https://greasyfork.org/ru/scripts/23387-wme-make-entryexit
// @include https://*.waze.com/*editor/*
// @match https://*.waze.com/*map-editor/*
// @match https://*.waze.com/*editor*
// @match https://*.waze.com/*beta_editor/*
// @version     1.5.1.0
// @author skirda
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/23387/WME%20Make%20EntryExit.user.js
// @updateURL https://update.greasyfork.org/scripts/23387/WME%20Make%20EntryExit.meta.js
// ==/UserScript==


//"use strict";
var wmeMEE_version="1.5.1.0";
console.log("START 'WME Make EntryExit' "+wmeMEE_version);

var wmeMEE_Debug=true;
var wmeMEE_SrcSegment=[17, 20]; // Дорога на парковке = 20, Частная дорога = 17
var wmeMEE_DestSegment=[1,2,3,4,6,7]; // 1 - street, 2 - prim, 7 - шоссе, 6 - важн.шоссе, 4 - рампа, 3 - free
var wmeMEE_CheckDest=true; // учитывать wmeMEE_DestSegment
var wmeMEE_LengthSegment=6; // минимальный размер сегмента, необходимый для оформления въезда-выезда
var wmeMEE_UserRank=-1;
var wmeMEE_MultiSegment=true; // всё за один раз?
var wmeMEE_TypeCourt=0;
var wmeMEE_Direct=2;
var IsMultiAction=false;

var wmeMEE_NameEE={
	"court":["въезд во двор","выезд из двора"],
	"parking":["на парковку","выезд с парковки"],
	"gas":["на АЗС","выезд с АЗС"]
};

var oWaze=null;
var oI18n=null;

var wazeActionUpdateFeatureAddress = null;
var wazeUpdateSegmentGeometry = null;
var wazeSplitSegments = null;
var wazeUpdateObject = null;
var WazeActionMultiAction = null;

var icons={
	"gas":    {n:'',i:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAA5BAMAAABDpP/QAAAAMFBMVEUhHRmenJu7z99iXlzk6/ACXqLV3eS/vr01frVLR0V8eXdYlcGPjYuEsdL9/f5toso99vbJAAABPElEQVR42mN4pwQFRWCkpKTygME/FA1EP2BIRRcLVWBQpbpYRAcygIj9e4cMroLFUITePUUSe8MAAlwoYi/BYpzIYm6ezKtWrVqJLPZkAgM7kHqILPaMvZIJQ4zvMaY6vpdsxKh7zvcSw7yEdY85F1sZL0ASe871cAG6mxXWOaCLPed5l5CMJlZw7l1CJqrY8znvMMSAytDFnvAAbXFAFXsz7x2GulfrQGKo9j5eh6n34TxMdWA7LB+juWWZn/K0h2tWnVqz6gzczRNmMvuhxq/eu+eCefA4VwWLRf+//xcM/t////83bdIkCWLXvn7a+mkrqlhGhoeHh+uPeGSxFI3U16kv3vZtRYhFpHqneqS6pikhiYX6piapJqnq5iKLRYBhKz39hi3vP8UQe8Dw5PduVPDtAQMwX6HBBwCJw+TzuAtUjwAAAABJRU5ErkJggg=='},
	"parking":{n:'',i:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAA5BAMAAACok0TTAAAAMFBMVEUHBweamprFxcpFRUW2trZJSY79/f55eayxstAsLn40NDSIirZpaWnX1+BWV5eZmsBHspaZAAAACXBIWXMAAC4jAAAuIwF4pT92AAABZ0lEQVR42pWTMUvDUBDH4+rk0lkQFAq6+B1cOxSjZJBOPVNE3CydOqpIEUJDe5S0fgUnKaKfwKlgwOGNEbK4KTrpe5ek795LhfonhPDLP3f37nLO6rOtW2e3bWvbqaGtfadSYnVnD3Gykek6JRYoFkGu086cBQUDP2MV5gOosm+FkmRnjFHwQQzg5XkDekR6+Y3Y5z4cA7zmvqjwYQwtnTdnW9DUOUwfj4fAWeYbUA6THQBMrbwN2QXU9RU6Ru0rdFXqX9Ero6cpZ5c/Uvee0XuPzcg6h56b5esv6VsUL/inD5esD5esrxQvEKLELM1ZmCSuG+p4SkcPjzdfvSn3hS849HDc5CxIcSKHMePsAnEo2WdK8dQehV1fxDS5k3ZCvsMeMPnE3jiSf4dikcFaVN/IYFXyhQbrZLW8nwM8ua5bp/WQ+7sp7yP6F9V6eLrmLh0UGx9/96q2YPfXS+zOWRFaM7Ejr7Vf5YZEVerBGTMAAAAASUVORK5CYII='},
	"court":  {n:'',i:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAA4BAMAAACI+Cx1AAAAMFBMVEUCXaGMtdXV3eJIibzr8PUrd7GqyODh5+1rn8mbvtr9/f7F1OEXaqpblcN1p8w7gbfthL9SAAABhUlEQVR42mNYXr0bBjYVbVLSVipfwFB2gAEOXoAIxgKGAoQQQweYVABCJHWRE2UYGDagilmtWoChzmrVGuzqiBKD6+WVk5N7gKbu45kzZy6DxM7evQAT6wc5H+YPqNgcIOaE+wMsxuwoKTlz9gSguvP/P0DFuC1WrVolU4NiB/d5oJjABhS3sLsAxUAqkNQxZyYKSk5rQFHH4wK0bdYFVDeDxKSAYh1Wq5Z2vICE1X0gPgxyc3R27qpVDqhhADSbGLEOItW1dXQ0oov9ewcCBShiDFjinKZinQGYYl4JmGJdAhhivLWY5kmtOoAuxubrhSHGYuDVCubxIInFrBIBO0bqA1yMPcbr9xoQb/YBuBgPzxV/sAqO5QFwezn1S4CxyyD8RKMGLvZL4DRI75X0gh64WPkB/rUga5kc4OYxAgWqQbxZE+BiUcAQkDrAw8DoXAEXawE64ZfBKQX2CbcWw90C9kKUwqkPPAdQw5kH6jUS4qMGQ6wApYwAg5MFDMuLlFBB+QIANwKq07RKQagAAAAASUVORK5CYII='},
	"free6":  {n:'',i:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAA5BAMAAABHUS/tAAAAMFBMVEUnJycCk0CxsbFJsXWm2bzf6uMyqGTn9e0ZnVEBkT+Nz6lqv47A5ND+//56xppZuIGDHOy7AAAACXBIWXMAAC4jAAAuIwF4pT92AAACfklEQVR42mWSv2tTURTHH/0PLkjpraIdHF3kYUoHEUEhDoFQSVrQ0CE2JYNQkDZd3lAwbR7ocImUd6y0ZHToLBkqZpEuwaFNH7Q9lY4OmZxKETw/7mstHsK7937yfeec+z0vGCn5WJrxm+kguJerScz/aPjdq4mgbMBacPD+e2XKOI6kGJSJGWvgT77fsbS3VqBzAMYV8v2eV34TSIekn++X3T9KSmk3onxhH+ylEkjrtrFTODJXSuDtDYInht43quR/bRM7O4M6bSCrTvUX8GyI5w6MsayUNmAXu0P8TM0BXCpdAbtf0h4I5JzG0Z2qYbxWi8Er56q1XFUjDMMc/R4Vg0qKUZryAyMKTBEXgwr+F4vBi/AiOvkdSuTCBzgX0uuzkFSOodVq2dG1tXgc97T6WHSYPC29rM83Gntt7GmfSaU3GiHWXyMuJ5FXJl+nNlHhsbm4n92dPEKMFxAPTOYSTa2JmLJyEGcukXeTBFfX6cED9TOCIZ1jgvjLXflZyGCexqRKGKtkcMX5GVnbpjYHNBHEfZqHV24hF2Z4RAU0J3xiaJrytFanCZztJL6FnPlS+ZChecdenrts7jsMLSfBx/5TdK4vUJSz4HMm1BF5wTnxMLv7Np8OHFuFxyA5HXwUaD7IEnulJDsSU3Gw6v1cEKhKnPLKXYGaBc+8S9wmnnoo0+S5C3TjAsvq0kYkvdgt1FVyburB3UYtKEqt+tPdlHWgyqZCUJjWRTkph324ox9iV5TD6/CZKAsethXOslKMY888PGTlBl6Hp6zUnnE5gwctUr7NlHozTFvF4Pm6whXweTBXDO5qR/imVvXwyUQwMtOQWCqVdNOYDv4CIwicqGxA3icAAAAASUVORK5CYII='}
};

// для обхода мартышкиного бага - ломает Array
var DLscript = document.createElement("script");
DLscript.textContent = 'var wmeMEE_action = [];';
DLscript.setAttribute("type", "application/javascript");
document.body.appendChild(DLscript);


function WmeMEE_Commit()
{
	if (!IsMultiAction) return;
	if(wmeMEE_Debug) console.log("WmeMEE_Commit(), wmeMEE_action.length="+wmeMEE_action.length);
	if (wmeMEE_action.length !== 0)
	{
		wmeMEE_action.reverse();
		try{
		var i=W.model.actionManager.add(new WazeActionMultiAction(wmeMEE_action));
		}catch(e){if(wmeMEE_Debug) console.error(e)}
		wmeMEE_action.length=0;
	}
}

function WmeMEE_Config2String()
{
	var jsn={};
	for(var i in wmeMEE_NameEE)
	{
		jsn[i]=wmeMEE_NameEE[i];
	}
	return JSON.stringify(jsn);
}

function WmeMEE_GetSegmentLength(xy1,xy2)
{
	var p1=new OpenLayers.Geometry.Point(xy1.x,xy1.y);
	var p2=new OpenLayers.Geometry.Point(xy2.x,xy2.y);
	var line = new OpenLayers.Geometry.LineString([p1, p2]);
	return {l:line.getLength(), g:line.getGeodesicLength(W.map.getProjectionObject())};
}

function WmeMEE_GetSegmentLengths(seg)
{
	var alen=[];
	for(var i=0; i < seg.length-1; ++i)
		alen.push(WmeMEE_GetSegmentLength(seg[i],seg[i+1]));
	return alen;
}


function WmeMEE_CalcPoints(geo,len,A)
{
	var xy={x1:0, y1:0, x2:0, y2:0, len:0, idx:0};

	// прямая?
	if (geo.components.length === 2)
	{
		if(wmeMEE_Debug) console.log("geo.components.length===2");
		xy.x1=geo.components[0].x;
		xy.y1=geo.components[0].y;
		xy.x2=geo.components[geo.components.length-1].x;
		xy.y2=geo.components[geo.components.length-1].y;
		xy.len=len;
		xy.idx=1;
		return xy;
	}


	var idx1=-1, idx2=-1;
	var allLength=0, allLengthG=0;
	var clen=WmeMEE_GetSegmentLengths(geo.components);

	// A
	if (A)
	{
		if(wmeMEE_Debug) console.log("A");

		// рассмотри размеры сегментов
		for (var i=0; i < clen.length; ++i)
		{
			idx1=i;
			idx2=i+1;
			//if (clen[i] < len)
			{
				if(wmeMEE_Debug) console.log("allLengthG ("+allLengthG+") + clen["+i+"].g ("+clen[i].g+")="+(allLengthG+clen[i].g)+" >? len="+len);
				if (allLengthG+clen[i].g > len)
				{
					if(wmeMEE_Debug) console.log("idx1="+idx1+", idx2="+idx2);
					xy.len=len-allLengthG;
					break;
				}
				allLength += clen[i].l;
				allLengthG+= clen[i].g;
			}
		}
		if(wmeMEE_Debug) console.log("allLength="+allLength);

		xy.idx=idx2;
		xy.x1=geo.components[idx1].x;
		xy.y1=geo.components[idx1].y;
		xy.x2=geo.components[idx2].x;
		xy.y2=geo.components[idx2].y;
	}
	else // B
	{
		if(wmeMEE_Debug) console.log("B");
		clen.reverse();
		console.log(clen);
		// рассмотри размеры сегментов
		for (let i=0; i < clen.length; ++i)
		{
			idx1=i;
			idx2=i+1;
			//if (clen[i] < len)
			{
				if(wmeMEE_Debug) console.log("allLengthG ("+allLengthG+") + clen["+i+"].g ("+clen[i].g+")="+(allLengthG+clen[i].g)+" >? len="+len);
				if (allLengthG+clen[i].g > len)
				{
					if(wmeMEE_Debug) console.log("idx1="+idx1+", idx2="+idx2);
					xy.len=len-allLengthG;
					break;
				}
				allLength += clen[i].l;
				allLengthG+= clen[i].g;
			}
		}
		if(wmeMEE_Debug) console.log("allLength="+allLength);

		xy.idx=geo.components.length-idx1-1;
		xy.x1=geo.components[geo.components.length-idx1-2].x;
		xy.y1=geo.components[geo.components.length-idx1-2].y;
		xy.x2=geo.components[geo.components.length-idx1-1].x;
		xy.y2=geo.components[geo.components.length-idx1-1].y;
	}

	if(wmeMEE_Debug) console.log(xy);
	return xy;
}

function WmeMEE_splitSegment(seg,len,A)
{
	if(wmeMEE_Debug) console.log("WmeMEE_splitSegment(seg,len="+len+",A="+A+")");
	var road=seg;
	if(!road)
		return null;

	var geo=road.geometry.clone();
	var action=null;
	var xy=WmeMEE_CalcPoints(geo,len,A);

	// грязный хак, но работает :-)
	var __M2U=function(x,y,len)
	{
		var L=0;
		var p1=new OpenLayers.Geometry.Point(x,y);
		var p2=new OpenLayers.Geometry.Point(x+100,y+100);
		var line = new OpenLayers.Geometry.LineString([p1, p2]);
		var m=line.getGeodesicLength(W.map.getProjectionObject());
		L=len*100/m;
		p2=new OpenLayers.Geometry.Point(x+L,y+L);
		line = new OpenLayers.Geometry.LineString([p1, p2]);
		m=line.getGeodesicLength(W.map.getProjectionObject());
		L=line.getLength();
		return L;
	};

	var L=__M2U(xy.x1,xy.y1,xy.len); // преобразование из нормальных метров в меркаторные метры
	var d=Math.sqrt(Math.pow(xy.x2-xy.x1,2)+Math.pow(xy.y2-xy.y1,2)); // BUGBUG!!!
	if(wmeMEE_Debug) console.log("L="+L+", d="+d);

	if (d >= L && geo.components.length === 2 || geo.components.length > 2) // BUGBUG!!!
	{
		var x=(xy.x2-xy.x1)*L/Math.sqrt((Math.pow(xy.x1-xy.x2,2)+Math.pow(xy.y1-xy.y2,2)));
		var y=(xy.y2-xy.y1)*L/Math.sqrt((Math.pow(xy.x1-xy.x2,2)+Math.pow(xy.y1-xy.y2,2)));
		if(A)
		{
			x+=xy.x1;
			y+=xy.y1;
		}
		else
		{
			x=xy.x2-x;
			y=xy.y2-y;
		}
		//console.dir(geo);
		if(wmeMEE_Debug) console.log("x="+x+", y="+y+", A="+A+", splice("+(xy.idx)+")"); // A?1:-1
		geo.components.splice(xy.idx,0,new OL.Geometry.Point(x,y));
		//console.dir(geo);
		try{
			W.model.actionManager.add(new wazeUpdateSegmentGeometry(road,road.geometry,geo));
		}catch(e){if(wmeMEE_Debug) console.error(e)}
		try{
			action=new wazeSplitSegments(road,{splitAtPoint:road.geometry.components[(A || road.geometry.components.length<=2?xy.idx:road.geometry.components.length-2)]});
		}catch(e){if(wmeMEE_Debug) console.error(e)}
		try{
			W.model.actionManager.add(action);
		}catch(e){if(wmeMEE_Debug) console.error(e)}
		var RoadIds=[];
		if(action.splits!==null)
		{
			for(var i=0;i<action.splits.length;i++)
			{
				RoadIds.push(W.model.segments.objects[action.splits[i].attributes.id]);
			}
		}
		//console.log("RoadIds:");
		//console.log(RoadIds);
		//setTimeout(function() {W.selectionManager.select([RoadIds[0]])},50);
		return RoadIds;
	}
	return null;
}


function WmeMEE_CalcStreetNum(nodeConnections,findIDs)
{
	var cnt=0;
	console.log("wmeMEE_CheckDest="+wmeMEE_CheckDest);
	let segIDs=nodeConnections.getSegmentIds();
    console.log("segIDs=",segIDs);
	for(let i=0; i <= segIDs.length; ++i)
	{
		let seg0=W.model.segments.getObjectById(segIDs[i]);
        console.log("seg0=",seg0);
		if (seg0 && typeof seg0 !== "undefined")
			if(findIDs.indexOf(seg0.getRoadType()) >= 0)
				cnt++;
	}
	return cnt;
}


function isObjectEmpty(obj)
{
	return (typeof obj === "undefined")?false:Object.getOwnPropertyNames(obj).length === 0;// && obj.constructor === Object;
}

function WmeMEE_UpdateSegmentProperties(seg,streetname,lockrank,roadtype)
{
	var attr={};
	if (lockrank !== null)
		attr["lockRank"]=lockrank;
	if (roadtype !== null)
		attr["roadType"]=roadtype;
	if (!isObjectEmpty(attr))
	{
		if (!IsMultiAction)
			oWaze.model.actionManager.add(new wazeUpdateObject(seg, attr));
		else
			wmeMEE_action.push(new wazeUpdateObject(seg, attr));
		if(wmeMEE_Debug) console.log(wmeMEE_action);
	}
	if (streetname)
	{
		var address=seg.getAddress();
		/*
		countryID
		stateID
		emptyCity
		cityID
		cityName
		streetName
		emptyStreet
		houseNumber
		*/
		let attr={streetName: (streetname.length>0?streetname:null), emptyStreet: (streetname.length>0?false:true), cityName: address.getCityName(), cityID: address.getCity().getID(), emptyCity: address.getCity().isEmpty(), stateID: address.getState().getID(), countryID: address.getCountry().getID()};
		if (!IsMultiAction)
			oWaze.model.actionManager.add(new wazeActionUpdateFeatureAddress(seg,attr,{streetIDField:"primaryStreetID"}));
		else
			wmeMEE_action.push(new wazeActionUpdateFeatureAddress(seg,attr,{streetIDField:"primaryStreetID"}));
		console.log(wmeMEE_action);
	}
}

//"["Waze/Action/CompositeAction"]/n<.getBounds@https://www.waze.com/assets-editor/javascripts/WME-c14112b1.js:5:4481["Waze/Action/CompositeAction"]/n<.getBounds@https://www.waze.com/assets-editor/javascripts/WME-c14112b1.js:5:4653["Waze/ActionManager"]/n<.getChangesBounds@https://www.waze.com/assets-editor/javascripts/WME-c14112b1.js:7:1["Waze/Model/LiveUsersMapAdapter"]/</e<.getEditArea@https://www.waze.com/assets-editor/javascripts/WME-c14112b1.js:15:20343["Waze/Model/LiveUsersMapAdapter"]/</e<._onEditAreaChange@https://www.waze.com/assets-editor/javascripts/WME-c14112b1.js:15:20172OpenLayers.Events<.triggerEvent@https://www.waze.com/assets-editor/javascripts/OL-cc3d97cc.js:91:5025["Waze/ActionManager"]/n<.add@https://www.waze.com/assets-editor/javascripts/WME-c14112b1.js:6:31335WmeMEE_Commit@chrome://greasemonkey-modules/content/sandbox.js -> file:///C:/Users/VSkirdin/AppData/Roaming/Mozilla/Firefox/Profiles/ra9xot1k.default/gm_scripts/WME_Make_EntryExit/WME-MakeEntryExit.user.js:56:9WmeMEE_DoActionOne@chrome://greasemonkey-modules/content/sandbox.js -> file:///C:/Users/VSkirdin/AppData/Roaming/Mozilla/Firefox/Profiles/ra9xot1k.default/gm_scripts/WME_Make_EntryExit/WME-MakeEntryExit.user.js:431:5WmeMEE_DoAction@chrome://greasemonkey-modules/content/sandbox.js -> file:///C:/Users/VSkirdin/AppData/Roaming/Mozilla/Firefox/Profiles/ra9xot1k.default/gm_scripts/WME_Make_EntryExit/WME-MakeEntryExit.user.js:521:3"


function WmeMEE_SetInfo(info)
{
	if(wmeMEE_Debug) console.log("WmeMEE_SetInfo('"+info+"')");
	var wmemee_info=document.getElementById("wmemee_info")
	if (wmemee_info)
	{
		wmemee_info.innerHTML=info;
	}
}

function WmeMEE_DoActionOne(typeEE, segment0)
{
	wmeMEE_action.length=0;

	if(wmeMEE_Debug) console.log("WmeMEE_DoActionOne()");

	var getNewTypeForCourt=function(typeEE, roadType, bThisSrc)
	{
		/*
			0	Не менять типы сегментов
			1	источник -> не менять, въезд  -> паркинг (20)
			2	источник -> не менять, въезд  -> приват (17)
			3	источник -> паркинг, въезд  -> паркинг
			4	источник -> паркинг, въезд  -> приват
			5	источник -> приват, въезд  -> паркинг
			6	источник -> приват, въезд -> приват
		*/
		var newType=null;
		if (typeEE==="court" && wmeMEE_TypeCourt > 0)
		{
			switch (wmeMEE_TypeCourt)
			{
				case 1: // источник -> не менять, въезд  -> паркинг
					if (!bThisSrc)
						newType=20;
					break;
				case 2: // источник -> не менять, въезд  -> приват
					if (!bThisSrc)
						newType=17;
					break;
				case 3: // источник -> паркинг, въезд  -> паркинг
					newType=20;
					break;
				case 4: // источник -> паркинг, въезд  -> приват
					newType=bThisSrc?20:17;
					break;
				case 5: // источник -> приват, въезд  -> паркинг
					newType=bThisSrc?17:20;
					break;
				case 6: // источник -> приват, въезд -> приват
					newType=17;
					break;
			}
		}
		return newType;
	};

	// это наш клиент?
	if (typeEE === "free6" || wmeMEE_SrcSegment.indexOf(segment0.getRoadType()) >= 0)
	{
		// считаем соседей
		var A=wmeMEE_CheckDest?WmeMEE_CalcStreetNum(segment0.getFromNode(), wmeMEE_DestSegment):1;
		var B=wmeMEE_CheckDest?WmeMEE_CalcStreetNum(segment0.getToNode()  , wmeMEE_DestSegment):1;

		if (wmeMEE_Debug) console.log("A="+A,"B="+B);

		if (A || B)
		{
			var roadType=segment0.getRoadType();

			// двунаправленный сегмент?
			if (segment0.attributes.fwdDirection && segment0.attributes.revDirection)
			{
				if (wmeMEE_Debug) console.log("fwdDirection && revDirection");

				// если длина сегмента меньше 3-х минимальных - в морг
				if (WmeMEE_GetSegmentLengths(segment0.geometry.components) < wmeMEE_LengthSegment*(typeEE !== "free6"?3:2))
					return;

				if (!wmeMEE_CheckDest && wmeMEE_Direct < 2)
				{
					// принудительно задаём направление!
					if (!wmeMEE_Direct) { A+=1000; } else { B+=1000; }
				}
				if (wmeMEE_Debug) console.log("A="+A,"B="+B);

				// первый разрез - дофига и рабочий ("двойной минимальным")
				var roads=WmeMEE_splitSegment(segment0,wmeMEE_LengthSegment*(typeEE === "free6"?1:2),A>=B?true:false);
				if (roads)
				{
					if (typeEE !== "free6")
					{
						if (wmeMEE_Debug) console.log("----------- режим рабочий сегмент пополам -----------");
						// режим рабочий сегмент пополам
						var roads2=WmeMEE_splitSegment(roads[A>=B?0:roads.length-1],wmeMEE_LengthSegment,true);
						if (roads2)
						{
							var idx=[0,1];
							if(A<B) idx=[1,0];

							// именуем сегменты
							WmeMEE_UpdateSegmentProperties(roads2[idx[0]],wmeMEE_NameEE[typeEE][0],wmeMEE_UserRank,getNewTypeForCourt(typeEE, roadType, false));
							WmeMEE_UpdateSegmentProperties(roads2[idx[1]],wmeMEE_NameEE[typeEE][1],wmeMEE_UserRank,getNewTypeForCourt(typeEE, roadType, false));  // паркинг!
							//W.selectionManager.select([roads2[1]]);
						}
						else
							if(wmeMEE_Debug) console.warn("roads2 null");

						// остаток
						if (typeEE==="court" && wmeMEE_TypeCourt > 0)
						{
							WmeMEE_UpdateSegmentProperties(roads[A<B?0:roads.length-1],null,null, getNewTypeForCourt(typeEE, roadType, true)); // приват
						}
					}
					else
					{
						WmeMEE_UpdateSegmentProperties(roads[A>=B?0:roads.length-1],null,wmeMEE_UserRank,null);
					}
				}
				else
					if(wmeMEE_Debug) console.warn("roads null");

				WmeMEE_Commit();
			}
			else
			{
				// если длина сегмента меньше 3-х минимальных - в морг
				if (WmeMEE_GetSegmentLengths(segment0.geometry.components) < wmeMEE_LengthSegment*2)
					return;

				// однонаправленный сегмент? здесь только 1 кусок
				if (segment0.attributes.fwdDirection && !segment0.attributes.revDirection)
				{
					if(wmeMEE_Debug) console.log("fwdDirection && !revDirection");
					let roads=WmeMEE_splitSegment(segment0,wmeMEE_LengthSegment,true);
					if (roads)
					{
						WmeMEE_UpdateSegmentProperties(roads[0],(typeEE === "free6"?null:wmeMEE_NameEE[typeEE][0]),wmeMEE_UserRank,getNewTypeForCourt(typeEE, roadType, false));

						// остаток
						if (typeEE==="court" && wmeMEE_TypeCourt > 0)
						{
							WmeMEE_UpdateSegmentProperties(roads[A<B?0:roads.length-1],null,null, getNewTypeForCourt(typeEE, roadType, true)); // приват
						}
					}
					else
						if(wmeMEE_Debug) console.warn("roads null");
				}
				else if (!segment0.attributes.fwdDirection && segment0.attributes.revDirection)
				{
					if(wmeMEE_Debug) console.log("!fwdDirection && revDirection");
					let roads=WmeMEE_splitSegment(segment0,wmeMEE_LengthSegment,false);
					if (roads)
					{
						WmeMEE_UpdateSegmentProperties(roads[1],(typeEE === "free6"?null:wmeMEE_NameEE[typeEE][0]),wmeMEE_UserRank,getNewTypeForCourt(typeEE, roadType, false));
						// остаток
						if (typeEE==="court" && wmeMEE_TypeCourt > 0)
						{
							WmeMEE_UpdateSegmentProperties(roads[A<B?0:roads.length-1],null,null, getNewTypeForCourt(typeEE, roadType, true)); // приват
						}
					}
					else
						if(wmeMEE_Debug) console.warn("roads null");
				}
				else
					if(wmeMEE_Debug) console.log("!fwdDirection && !revDirection");
				WmeMEE_Commit();
			}
		}
		else
			if(wmeMEE_Debug) console.warn("!A && !B === null");
	} // if (wmeMEE_SrcSegment.indexOf...)
	else
		if(wmeMEE_Debug) console.warn("not wmeMEE_SrcSegment (roadType="+segment0.getRoadType()+")");
}

function WmeMEE_DoAction(typeEE)
{
	if(wmeMEE_Debug) console.log("WmeMEE_DoAction()");
	if (W.selectionManager.getSelectedFeatures().length <= 0)
	{
		if(wmeMEE_Debug) console.warn("WmeMEE_DoAction(): no selected object");
		return;
	}

	if (W.selectionManager.getSelectedFeatures()[0].model.type !== "segment")
	{
		if(wmeMEE_Debug) console.warn("WmeMEE_DoAction(): no selected segment");
		return;
	}

	if (typeof typeEE  === "object")
		typeEE=this.id.replace(/wmemee_(.*)/,"$1");

	if(wmeMEE_Debug) console.warn("typeEE='"+typeEE+"'");

	if (typeEE !== "free6" && (typeof wmeMEE_NameEE[typeEE] === "undefined"))
	{
		if(wmeMEE_Debug) console.warn("WmeMEE_DoAction(): undef typeEE='"+typeEE+"'");
		return;
	}

	var EndCount=1;
	if (wmeMEE_MultiSegment)
		EndCount=W.selectionManager.getSelectedFeatures().length;


	for (var idxseg=0; idxseg < EndCount; ++idxseg)
	{
		if(wmeMEE_Debug) console.log("Process idxseg="+idxseg);

		// здесь индекс всегда 0, т.к. с очередного сегмента снимается выделение!
		WmeMEE_DoActionOne(typeEE,W.selectionManager.getSelectedFeatures()[0].model);
	}
}

function CreateID(end)
{
	return 'WME-MakeEntryExit-' + wmeMEE_version.replace(/\./g,"-") + '-'+ end;
}


function getElementsByClassName(classname, node) {
	if(!node)
		node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}


function WmeMEE_InitAction()
{
	if(wmeMEE_Debug) console.log("WmeMEE_InitAction()");
	wmeMEE_Direct=2;
	if(!document.getElementById(CreateID('act')))
	{
		var srsCtrl = document.createElement('section');
		srsCtrl.id = CreateID('act');

		var editTabs = document.getElementById('edit-panel');
		if (typeof editTabs !== "undefined")
		{
			var navTabs = getElementsByClassName('nav-tabs', editTabs)[0];
			if (typeof navTabs !== "undefined")
			{
				var tabContent = getElementsByClassName('tab-content', editTabs)[0];
				if (typeof tabContent !== "undefined")
				{
					let newtab = document.createElement('li');
					// fa ==> http://fontawesome.io/cheatsheet/
					newtab.innerHTML = '<a title="WME Make EntryExit" href="#' + CreateID('act') + '" id="pwmemakeentryexit" data-toggle="tab"><span class="fa fa-sign-in" id="wmemee_picture"></span>&nbsp;MEE</a>';
					navTabs.appendChild(newtab);

					var padding="padding:5px 9px";

					var strFormCode = ''+
						'<div class="side-panel-section">'+
						'<h4>WME Make EntryExit <sup>' + wmeMEE_version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/ru/scripts/23387-wme-make-entryexit" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'+
						'<form class="attributes-form side-panel-section" action="javascript:return false;">';

					// -------------------------------
					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<label class="control-label">Типы</label>'+
								'<button id="wmemee_gas"     class="btn btn-default" style="cursor: pointer; width: 38px; height: 57px; background-repeat: no-repeat; background-size: 37px 57px; background-position: center; background-image: url('+icons["gas"].i+');" title="Заправка. Оформить въезд/выезд (6.7)"></button>&nbsp;'+
								'<button id="wmemee_court"   class="btn btn-default" style="cursor: pointer; width: 38px; height: 57px; background-repeat: no-repeat; background-size: 37px 56px; background-position: center; background-image: url('+icons["court"].i+');" title="Двор. Оформить въезд/выезд (5.31)"></button>&nbsp;'+
								'<button id="wmemee_parking" class="btn btn-default" style="cursor: pointer; width: 38px; height: 57px; background-repeat: no-repeat; background-size: 38px 57px; background-position: center; background-image: url('+icons["parking"].i+');" title="Парковка. Оформить въезд/выезд (5.38.1?)"></button>&nbsp;'+
								'<button id="wmemee_free6"   class="btn btn-default" style="cursor: pointer; width: 38px; height: 57px; background-repeat: no-repeat; background-size: 39px 57px; background-position: center; background-image: url('+icons["free6"].i+');" title="Отрезать 1 минимальный кусок на любом сегменте (5.1)"></button>&nbsp;'+
							'</div>'+
						'</div>';

					strFormCode += ''+
						'<div class="form-group"">'+
							'<div class="controls">'+
								'<label class="control-label">Направления</label>'+
								'<div class="btn-group" data-toggle="buttons">'+
									'<label class="btn btn-default" id="wmemee_cfg_direct0" title="Резать начиная с точки A"><input name="wmemee_cfg_direct" value="0" type="radio">AB</label>'+
									'<label class="btn btn-default" id="wmemee_cfg_direct1" title="Резать начиная с точки B"><input name="wmemee_cfg_direct" value="1" type="radio">BA</label>'+
									'<label class="active btn btn-default" id="wmemee_cfg_direct2" title="Резать с учетом соседей" ><input name="wmemee_cfg_direct" value="2" type="radio">Auto</label>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'';

					strFormCode += ''+
						'<div class="form-group"">'+
							'<div class="controls">'+
								'<span id="wmemee_info">&nbsp;</span>'+
							'</div>'+
						'</div>'+
						'';

					// -------------------------------

					strFormCode += ''+
						'<div class="form-group">'+
							'<label class="control-label"><h5>Настройки</h5></label>'+
							'';

					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<input name="wmemee_cfg_checkdest" value="" id="wmemee_cfg_checkdest" type="checkbox"><label for="wmemee_cfg_checkdest" title="Оформлять выъезд/выезд учитывая тип примыкающих сегментов">&nbsp;'+'Учитывать соседей'+'</label><br>'+
							'</div>'+
						'</div>';


					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<label class="control-label" title="">Двор, въезд:</label>'+
								'<input name="wmemee_cfg_court_entry" class="form-control" value="" id="wmemee_cfg_court_entry" type="text" size="13" data="court">'+
								'<label class="control-label" title="">Двор, выезд:</label>'+
								'<input name="wmemee_cfg_court_exit" class="form-control" value="" id="wmemee_cfg_court_exit" type="text" size="13" data="court">'+
							'</div>'+
							'<div class="controls">'+
								'<label class="control-label" title="">Парковка, въезд:</label>'+
								'<input name="wmemee_cfg_parking_entry" class="form-control" value="" id="wmemee_cfg_parking_entry" type="text" size="13" data="parking">'+
								'<label class="control-label" title="">Парковка, выезд:</label>'+
								'<input name="wmemee_cfg_parking_exit" class="form-control" value="" id="wmemee_cfg_parking_exit" type="text" size="13" data="parking">'+
							'</div>'+
							'<div class="controls">'+
								'<label class="control-label" title="">АЗС, въезд:</label>'+
								'<input name="wmemee_cfg_gas_entry" class="form-control" value="" id="wmemee_cfg_gas_entry" type="text" size="13" data="gas">'+
								'<label class="control-label" title="">АЗС, выезд:</label>'+
								'<input name="wmemee_cfg_gas_exit" class="form-control" value="" id="wmemee_cfg_gas_exit" type="text" size="13" data="gas">'+
							'</div>'+
						'</div>';

					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<label class="control-label" title="Минимальная длина сегмента">Длина сегмента (м):</label>'+
								'<input name="wmemee_cfg_length" class="form-control" value="" id="wmemee_cfg_length" type="text" size="13">'+
							'</div>'+
						'</div>';

					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<label class="control-label" title="Уровень блокировки новых сегментов">'+I18n.translations[I18n.locale].edit.segment.fields.lock+'</label>'+
								'<select class="form-control" data-type="numeric" id="wmemee_cfg_UserRank"><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option><option value="4">5</option><option value="5">6</option></select>'+
							'</div>'+
						'</div>';

					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<label class="control-label" title="Как оформлять въезд (выезд) во двор">Правила для двора</label>'+
								'<select class="form-control" data-type="numeric" id="wmemee_cfg_typecourt">'+
									'<option value="0">Не менять типы сегментов</option>'+
									'<option value="1">источник &#x2192; не менять, въезд  &#x2192; паркинг</option>'+
									'<option value="2">источник &#x2192; не менять, въезд  &#x2192; приват</option>'+
									'<option value="3">источник &#x2192; паркинг, въезд  &#x2192; паркинг</option>'+
									'<option value="4">источник &#x2192; паркинг, въезд  &#x2192; приват</option>'+
									'<option value="5">источник &#x2192; приват, въезд  &#x2192; паркинг</option>'+
									'<option value="6">источник &#x2192; приват, въезд  &#x2192; приват</option>'+
								'</select>'+
							'</div>'+
						'</div>';

					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<input name="wmemee_cfg_multi" value="" id="wmemee_cfg_multi" type="checkbox"><label for="wmemee_cfg_multi" title="Оформить несколько выделенных сегментов">&nbsp;'+'Несколько сегментов'+'</label><br>'+
							'</div>'+
						'</div>';

					strFormCode += ''+
						'<div class="form-group">'+
							'<div class="controls">'+
								'<input name="wmemee_cfg_debug" value="" id="wmemee_cfg_debug" type="checkbox"><label for="wmemee_cfg_debug" title="Debug script">&nbsp;'+'Debug script'+'</label><br>'+
							'</div>'+
						'</div>';

					strFormCode += ''+
						'</div>'+
						'';

					strFormCode += ''+
						'</form>'+
						'</div>'+
						'';
					srsCtrl.className = "tab-pane";
					srsCtrl.innerHTML=strFormCode;
					tabContent.appendChild(srsCtrl);
				}
				else
				{
					//if(wmeMEE_Debug) console.error("WME-MakeEntryExit (" + wmeMEE_version + "): WmeMEE_InitAction(): typeof tabContent === 'undefined'");
					srsCtrl.id='';
				}
			}
			else
			{
				//if(wmeMEE_Debug) console.error("WME-MakeEntryExit (" + wmeMEE_version + "): WmeMEE_InitAction(): typeof navTabs === 'undefined'");
				srsCtrl.id='';
			}
		}
		else
		{
			//if(wmeMEE_Debug) console.error("WME-MakeEntryExit (" + wmeMEE_version + "): WmeMEE_InitAction(): typeof editTabs === 'undefined'");
			srsCtrl.id='';
		}

		if(srsCtrl.id !== '')
		{
			document.getElementById("wmemee_gas").onclick = WmeMEE_DoAction;
			document.getElementById("wmemee_parking").onclick = WmeMEE_DoAction;
			document.getElementById("wmemee_court").onclick = WmeMEE_DoAction;
			document.getElementById("wmemee_free6").onclick = WmeMEE_DoAction;


			for (var i in wmeMEE_NameEE)
			{
				document.getElementById("wmemee_cfg_"+i+"_entry").value = wmeMEE_NameEE[i][0];
				document.getElementById("wmemee_cfg_"+i+"_entry").onchange = function(){
					var id=this.getAttribute('data');
					wmeMEE_NameEE[id][0]=this.value;
					localStorage.setItem('wmeMEE_NameEE', WmeMEE_Config2String());
				};
				document.getElementById("wmemee_cfg_"+i+"_exit").value = wmeMEE_NameEE[i][1];
				document.getElementById("wmemee_cfg_"+i+"_exit").onchange = function(){
					var id=this.getAttribute('data');
					wmeMEE_NameEE[id][1]=this.value;
					localStorage.setItem('wmeMEE_NameEE', WmeMEE_Config2String());
				};
			}


			var wmemee_cfg_direct=document.getElementsByName("wmemee_cfg_direct");
			//document.getElementById("wmemee_cfg_direct"+wmeMEE_Direct).setAttribute('class',"active btn btn-default");
			for(let i=0; i < wmemee_cfg_direct.length; ++i)
			{
				wmemee_cfg_direct[i].onchange = function(){wmeMEE_Direct=parseInt(this.value);console.log("wmeMEE_Direct="+wmeMEE_Direct)};
				//if (wmeMEE_Direct !== i) document.getElementById("wmemee_cfg_direct"+i).setAttribute('class',"btn btn-default");
				//wmemee_cfg_direct[i].checked=false;
			}
			//wmemee_cfg_direct[wmeMEE_Direct].checked=true;


			document.getElementById("wmemee_cfg_checkdest").onclick = function(){wmeMEE_CheckDest=this.checked;localStorage.setItem("wmeMEE_CheckDest",wmeMEE_CheckDest?"1":"0");WmeMEE_EnableDisableButton();};
			document.getElementById("wmemee_cfg_checkdest").checked = wmeMEE_CheckDest;

			document.getElementById("wmemee_cfg_multi").onclick = function(){wmeMEE_MultiSegment=this.checked;localStorage.setItem("wmeMEE_MultiSegment",wmeMEE_MultiSegment?"1":"0");};
			document.getElementById("wmemee_cfg_multi").checked = wmeMEE_MultiSegment;

			document.getElementById("wmemee_cfg_typecourt").onclick = function(){wmeMEE_TypeCourt=parseInt(this.value);localStorage.setItem("wmeMEE_TypeCourt",wmeMEE_TypeCourt);};
			document.getElementById("wmemee_cfg_typecourt").selectedIndex = wmeMEE_TypeCourt;

			document.getElementById("wmemee_cfg_UserRank").selectedIndex = wmeMEE_UserRank;
			document.getElementById("wmemee_cfg_UserRank").onchange = function(){wmeMEE_UserRank=this.value;localStorage.setItem("wmeMEE_UserRank",wmeMEE_UserRank);};

			document.getElementById("wmemee_cfg_length").value = wmeMEE_LengthSegment;
			document.getElementById("wmemee_cfg_length").onchange = function(){wmeMEE_LengthSegment=parseInt(this.value);localStorage.setItem("wmeMEE_length",wmeMEE_LengthSegment);};

			document.getElementById("wmemee_cfg_debug").onclick = function(){wmeMEE_Debug=this.checked;localStorage.setItem("wmeMEE_Debug",wmeMEE_Debug?"1":"0");};
			document.getElementById("wmemee_cfg_debug").checked = wmeMEE_Debug;

		}
	}
	else
		;//if(wmeMEE_Debug) console.warn("WME-MakeEntryExit (" + wmeMEE_version + "): WmeMEE_InitAction(): not found '"+CreateID('act')+"'");

	WmeMEE_EnableDisableButton();
}

function WmeMEE_EnableDisableButton()
{
	if(document.getElementById(CreateID('act')) != null)
	{
		WmeMEE_SetInfo("");

		var EndCount=1;
		if (wmeMEE_MultiSegment)
			EndCount=W.selectionManager.getSelectedFeatures().length;

		// проверяем - а не нужно ли залочить кнопки?
		var disabled=1;
		if (W.selectionManager.getSelectedFeatures()[0].model.type === "segment")
		{
			disabled=0;
			for (var idxseg=0; idxseg < EndCount; ++idxseg)
			{
				var segment0 = W.selectionManager.getSelectedFeatures()[idxseg].model;

				if (isObjectEmpty(segment0.attributes.fromConnections))
					WmeMEE_SetInfo("<font color='red'>fromConnections empty</font>");

				if (wmeMEE_SrcSegment.indexOf(segment0.getRoadType()) >= 0)
				{
					if (wmeMEE_CheckDest)
					{
						var A=WmeMEE_CalcStreetNum(segment0.getFromNode(), wmeMEE_DestSegment);
						var B=WmeMEE_CalcStreetNum(segment0.getToNode()  , wmeMEE_DestSegment);
//console.error("A="+A+", B="+B);
						if (!A && !B)
							disabled++;
					}
				}
				else
				{
//console.error("segment0.getRoadType()="+segment0.getRoadType());
					disabled++;
				}
			}
		}

		document.getElementById("wmemee_gas").disabled=disabled?true:false;
		document.getElementById("wmemee_parking").disabled=disabled?true:false;
		document.getElementById("wmemee_court").disabled=disabled?true:false;
		//document.getElementById("wmemee_free6").disabled=disabled?true:false;

		document.getElementById("wmemee_picture").setAttribute('style',disabled?'color:red;':'color:green;');
	}
}

function WmeMEE_DoActionHand()
{
	if ((typeof arguments[0]) === "object")
	{
		console.log(arguments[0]);
		WmeMEE_DoAction(arguments[0].type);
	}
}

function WmeMEE_initBindKey()
{
	var Config =[
		{handler: 'WMERequest_court',    title: "Двор",     func:WmeMEE_DoActionHand, key:-1, arg:{type:'court'}},
		{handler: 'WMERequest_parking',  title: "Парковка", func:WmeMEE_DoActionHand, key:-1, arg:{type:'parking'}},
		{handler: 'WMERequest_gas',      title: "АЗС",      func:WmeMEE_DoActionHand, key:-1, arg:{type:'gas'}}
	];

	for(var i=0; i < Config.length; ++i)
	{
		WMEKSRegisterKeyboardShortcut('WME-MakeEntryExit', 'WME-MakeEntryExit', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
	}

	WMEKSLoadKeyboardShortcuts('WME-MakeEntryExit');

	window.addEventListener("beforeunload", function() {
		WMEKSSaveKeyboardShortcuts('WME-MakeEntryExit');
	}, false);

}

function WmeMEE_InitializeI18n()
{
	console.log("WmeMEE_InitializeI18n()");
}

function WmeMEE_bootstrap()
{
	console.log("WmeMEE_bootstrap()");
	oWaze=Window.W;
	if (typeof oWaze === "undefined")
		oWaze=W;

	oI18n=Window.I18n;
	if (typeof oI18n === "undefined")
		oI18n=I18n;

	if (typeof unsafeWindow !== "undefined")
	{
		oWaze=unsafeWindow.W;
		oI18n=unsafeWindow.I18n;
	}

	if (typeof oWaze === "undefined")
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): Waze");
		setTimeout(WmeMEE_bootstrap, 500);
		return;
	}
	if (typeof oWaze.map === "undefined")
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): Waze.map");
		setTimeout(WmeMEE_bootstrap, 500);
		return;
	}
	if (typeof oWaze.selectionManager === "undefined")
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): Waze.selectionManager");
		setTimeout(WmeMEE_bootstrap, 500);
		return;
	}
	if (typeof oI18n === "undefined")
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): I18n");
		setTimeout(WmeMEE_bootstrap, 500);
		return;
	}
	if (typeof oI18n.translations === "undefined")
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): I18n.translations");
		setTimeout(WmeMEE_bootstrap, 500);
		return;
	}
	if (document.getElementsByClassName('nav-tabs')[0] === null)
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): nav-tabs");
		setTimeout(WmeMEE_bootstrap,3000);
		return;
	}
	if (document.getElementsByClassName('tab-content')[0] === null)
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): tab-content");
		setTimeout(WmeMEE_bootstrap,3000);
		return;
	}
	if (document.getElementById('user-info') === null)
	{
		if (wmeMEE_Debug) console.log("WmeMEE_bootstrap(): user-info");
		setTimeout(WmeMEE_bootstrap,3000);
		return;
	}
    if (typeof require === "undefined")
    {
        console.log("undef require");
        setTimeout(WmeMEE_bootstrap,1000);
        return;
    }


	wazeActionUpdateFeatureAddress = require("Waze/Action/UpdateFeatureAddress");
	wazeUpdateSegmentGeometry = require("Waze/Action/UpdateSegmentGeometry");
	wazeSplitSegments = require("Waze/Action/SplitSegments");
	wazeUpdateObject = require("Waze/Action/UpdateObject");
	WazeActionMultiAction = require ("Waze/Action/MultiAction");


	wmeMEE_Debug          = __GetLocalStorageItem("wmeMEE_Debug",'bool',false);

	wmeMEE_TypeCourt      = __GetLocalStorageItem("wmeMEE_TypeCourt",'int',0);
	wmeMEE_LengthSegment  = __GetLocalStorageItem("wmeMEE_length",'int',6);
	try {
		wmeMEE_UserRank   = __GetLocalStorageItem("wmeMEE_UserRank",'int',W.loginManager.user.rank);
	}
	catch (err) {
		console.error('wme_2gis error: '+err.message);
	}
	wmeMEE_MultiSegment   = __GetLocalStorageItem("wmeMEE_MultiSegment",'bool',true);
	wmeMEE_CheckDest      = __GetLocalStorageItem("wmeMEE_CheckDest",'bool',true);

	function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	if ("undefined" === typeof localStorage.wmeMEE_NameEE || !IsJsonString(localStorage.getItem('wmeMEE_NameEE')))
		localStorage.setItem('wmeMEE_NameEE', WmeMEE_Config2String());

	wmeMEE_NameEE=JSON.parse(localStorage.getItem("wmeMEE_NameEE"));
	//console.log(wmeMEE_NameEE);

	WmeMEE_InitializeI18n();
	WmeMEE_initBindKey();
	W.selectionManager.events.register("selectionchanged", null, WmeMEE_InitAction);
}


function __GetLocalStorageItem(Name,Type,Def,Arr)
{
	//if (wme2GIS_debug) console.log("__GetLocalStorageItem(): Name="+Name+",Type="+Type+",Def="+Def+",Arr="+Arr);
	var tmp0=localStorage.getItem(Name);
	if (tmp0)
	{
		switch(Type)
		{
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

/*
// hack for require
(function() {
	if(typeof WMEAPI !== "undefined") {console.log("Found WMEAPI!");return;}
	function patch() {if(typeof require !== "undefined") return; var WMEAPI={};for(WMEAPI.scripts=document.getElementsByTagName("script"),WMEAPI.url=null,i=0;i<WMEAPI.scripts.length;i++)if(WMEAPI.scripts[i].src.indexOf("/assets-editor/js/app")!=-1){WMEAPI.url=WMEAPI.scripts[i].src;break}if(null==WMEAPI.url)throw new Error("WME Hack: can't detect WME main JS");WMEAPI.require=function(a){return WMEAPI.require.define.modules.hasOwnProperty(a)?WMEAPI.require.define.modules[a]:(console.error("Require failed on "+a,WMEAPI.require.define.modules),null)},WMEAPI.require.define=function(a){0==WMEAPI.require.define.hasOwnProperty("modules")&&(WMEAPI.require.define.modules={});for(var b in a)WMEAPI.require.define.modules[b]=a[b]},WMEAPI.tmp=window.webpackJsonp,WMEAPI.t=function(a){if(WMEAPI.s[a])return WMEAPI.s[a].exports;var b=WMEAPI.s[a]={exports:{},id:a,loaded:!1};return WMEAPI.e[a].call(b.exports,b,b.exports,WMEAPI.t),b.loaded=!0,b.exports},WMEAPI.e=[],window.webpackJsonp=function(a,b){for(var d,e,c={},f=0,g=[];f<a.length;f++)e=a[f],WMEAPI.r[e]&&g.push.apply(g,WMEAPI.r[e]),WMEAPI.r[e]=0;var i,j,h=0;for(d in b)WMEAPI.e[d]=b[d],j=b[d].toString(),i=j.match(/CLASS_NAME:\"([^\"]*)\"/),i?c[i[1].replace(/\./g,"/").replace(/^W\//,"Waze/")]={index:d,func:WMEAPI.e[d]}:(c["Waze/Unknown/"+h]={index:d,func:WMEAPI.e[d]},h++);for(;g.length;)g.shift().call(null,WMEAPI.t);WMEAPI.s[0]=0;var l,k={};h=0;for(d in b)if(j=b[d].toString(),i=j.match(/CLASS_NAME:\"([^\"]*)\"/))k={},l=i[1].replace(/\./g,"/").replace(/^W\//,"Waze/"),k[l]=WMEAPI.t(c[l].index),WMEAPI.require.define(k);else{var m=j.match(/SEGMENT:"segment",/);m&&(k={},l="Waze/Model/ObjectType",k[l]=WMEAPI.t(c["Waze/Unknown/"+h].index),WMEAPI.require.define(k)),h++}window.webpackJsonp=WMEAPI.tmp,window.require=WMEAPI.require},WMEAPI.s={},WMEAPI.r={0:0},WMEAPI.WMEHACK_Injected_script=document.createElement("script"),WMEAPI.WMEHACK_Injected_script.setAttribute("type","application/javascript"),WMEAPI.WMEHACK_Injected_script.src=WMEAPI.url,document.body.appendChild(WMEAPI.WMEHACK_Injected_script);window.WMEAPI=WMEAPI;}
	var RPscript = document.createElement("script");
	RPscript.textContent =  patch.toString() + ';\n' + 'patch();';
	RPscript.setAttribute("type", "application/javascript");
	document.body.appendChild(RPscript);
}.call(this));
*/
WmeMEE_bootstrap();



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
