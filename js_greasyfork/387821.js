// ==UserScript==
// @name        COMP Revamp UK 1
// @namespace   harisonv@amazon.com
// @description Adds multiple features and functions to COMP
// @include     https://www.amazonlogistics-eu.com/*
// @exclude     
// @version     1.45
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/387821/COMP%20Revamp%20UK%201.user.js
// @updateURL https://update.greasyfork.org/scripts/387821/COMP%20Revamp%20UK%201.meta.js
// ==/UserScript==

var d = document;
//functions
function dateFunction(i) {
	var today = new Date();
	var futureDate = new Date();
	futureDate.setDate(today.getDate() + i);
	var MMM = futureDate.getMonth()+1;
	var d = futureDate.getDate();
	var yyyy = futureDate.getFullYear();
	if (MMM < 10) {
		MMM = "0" + MMM;
		}
	if (d < 10) {
		d = "0" + d;
	  }
	return MMM + "/" + d + "/" + yyyy;
	}

function gotoOrder() {
  var orderID = detailTable.childNodes[1].childNodes[21].childNodes[7].childNodes[0];
	var trackingID = detailTable.childNodes[1].childNodes[1].childNodes[3];
	if (/S01/.test(orderID.innerHTML)) {
		alert("\t\t\t\t\t\t\tWARNING\nOrder ID "+orderID.innerHTML+" is an MFN order and was not placed on an Amazon site.\n\n\t\t\t\tIt will not be searchable in CSC.");
	  } else {
			if (/Q/.test(trackingID.innerHTML)) {
				window.open("https://cscentral-eu.amazon.com/gp/stores/www.amazon.co.uk/gp/order/detail/?ie=UTF8&orderID=" + orderID.innerHTML);
				}
	  	}
  }

function compareGeoToAddress() {
	var addr = detailTable.childNodes[1].childNodes[17].childNodes[11].childNodes[0];
	var zipStart = detailTable.childNodes[1].childNodes[21].childNodes[11].innerHTML.indexOf("(")+1;
	var zipEnd = detailTable.childNodes[1].childNodes[21].childNodes[11].innerHTML.indexOf(")");
	var zip = detailTable.childNodes[1].childNodes[21].childNodes[11].innerHTML.substr(zipStart, (zipEnd-zipStart));
	window.open("https://www.google.com/maps/dir/" + addrLat.childNodes[0].innerHTML + " " + addrLong.childNodes[0].innerHTML + "/" + addr.innerHTML + " " + zip);
  }

function gotoGeoDataTool() {
	var trackingID = detailTable.childNodes[1].childNodes[1].childNodes[3];
	var newWindow = window.open("https://geoweb-na.amazon.com/GeoDataEditor/app/partials/edit_index.jsp");
	
	newWindow.document.getElementsByTagName("input")[0] = trackingID.innerHTML;
  }

function gotoRoutingTool() {
	var trackingID = detailTable.childNodes[1].childNodes[1].childNodes[3];
	var newWindow = window.open("https://routingtools-na.amazon.com/route/routevisualize.jsp");
	
	newWindow.document.getElementsByTagName("input")[0] = trackingID.innerHTML;
  }


var hOther = 0;
function hideOther() {
	if (hOther === 0) {
		hidden = 1;
		hOther = 1;
		inputAll.value = "Show All";
		inputAll.style.color = "red";
		inputOther.value = "Show Other";
		inputOther.style.color = "red";
	  } else {
						hOther = 0;
						inputOther.value = "Hide Other";
			      inputOther.style.color = "black";
			      if (hBC === 0 && hMS === 0 && hOther === 0) {
							hidden = 0;
							inputAll.value = "Hide All";
							inputAll.style.color = "black";
						  }
					  }
	var tbody = document.getElementsByTagName("tbody")[9];
	for (i=1; i<tbody.childNodes.length; i=i+2) {
	  var r = tbody.childNodes[i].innerHTML;
		if (!/Items Missing/g.test(r) && !/BUSINESS_CLOSED/g.test(r)) {
			if (hOther === 1) {
			  tbody.childNodes[i].style.display = 'none';
			  }
			if (hOther === 0) {
				tbody.childNodes[i].style = 'none';
			  }
		  }
	  }
  }

var hBC = 0;
function hideBC() {
	if (hBC === 0) {
		hidden = 1;
		hBC = 1;
		inputAll.value = "Show All";
		inputAll.style.color = "red";
		inputBC.value = "Show Business_Closed";
		inputBC.style.color = "red";
	  } else {
						hBC = 0;
						inputBC.value = "Hide Business_Closed";
			      inputBC.style.color = "black";
			      if (hBC === 0 && hMS === 0) {
							hidden = 0;
							inputAll.value = "Hide All";
							inputAll.style.color = "black";
						  }
					  }
	var tbody = document.getElementsByTagName("tbody")[9];
	for (i=1; i<tbody.childNodes.length; i=i+2) {
	  var r = tbody.childNodes[i].innerHTML;
		if (/BUSINESS_CLOSED/g.test(r)) {
			if (hBC === 1) {
			  tbody.childNodes[i].style.display = 'none';
			  }
			if (hBC === 0) {
				tbody.childNodes[i].style = 'none';
			  }
		  }
	  }
  }

var hMS = 0;
function hideMissing() {
	if (hMS === 0) {
		hidden = 1;
		hMS = 1;
		inputAll.value = "Show All";
		inputAll.style.color = "red";
		inputMS.value = "Show Items Missing";
		inputMS.style.color = "red";
	  } else {
						hMS = 0;
						inputMS.value = "Hide Items Missing";
			      inputMS.style.color = "black";
			      if (hBC === 0 && hMS === 0) {
							hidden = 0;
							inputAll.value = "Hide All";
							inputAll.style.color = "black";
						  }
					  }
	var tbody = document.getElementsByTagName("tbody")[9];
	for (i=1; i<tbody.childNodes.length; i=i+2) {
	  var r = tbody.childNodes[i].innerHTML;
		if (/Items Missing/g.test(r)) {
			if (hMS === 1) {
			  tbody.childNodes[i].style.display = 'none';
			  }
			if (hMS === 0) {
				tbody.childNodes[i].style = 'none';
			  }
		  }
	  }
  }

var hidden = 0;
function hideAll() {
	if (hidden === 0) {
		hidden = 1;
		hMS = 1;
		hBC = 1;
		hOther = 1;
		inputAll.value = "Show All";
		inputAll.style.color = "red";
		inputBC.value = "Show Business_Closed";
		inputBC.style.color = "red";
		inputMS.value = "Show Items Missing";
		inputMS.style.color = "red";
		inputOther.value = "Show Other";
		inputOther.style.color = "red";
	  } else {
			      hidden = 0; 
			      hMS = 0;
			      hBC = 0;
			      hOther = 0;
						inputAll.value = "Hide All";
			      inputAll.style.color = "black";
						inputBC.value = "Hide Business_Closed";
			      inputBC.style.color = "black";
					  inputMS.value = "Hide Items Missing";
			      inputMS.style.color = "black";
			      inputOther.value = "Hide Other";
			      inputOther.style.color = "black";
					  }
	var tbody = document.getElementsByTagName("tbody")[9];
	for (i=1; i<tbody.childNodes.length; i=i+2) {
		if (hidden === 1) {
		  tbody.childNodes[i].style.display = 'none';
		  }
		if (hidden === 0) {
			tbody.childNodes[i].style = 'none';
		  }
  	}
  }

function searchReset() {
	hidden= 0;
	hMS = 0;
	hBC = 0;
	hOther = 0;
	inputAll.value = "Hide All";
	inputAll.style.color = "black";
	inputBC.value = "Hide Business_Closed";
	inputBC.style.color = "black";
	inputMS.value = "Hide Items Missing";
	inputMS.style.color = "black";
	inputOther.value = "Hide Other";
	inputOther.style.color = "black";
  }

function makeDetailsButton(btnName,btnLoc,fn) {
	var input = document.createElement("input");
	input.type="button";
	input.value=btnName;
	input.onclick = fn;
	input.setAttribute("style", "font-size:12px;");
	btnLoc.appendChild(input);
  }

//makes edits to shipmentDetails page
var url = location.href;
if(/^http[s]:\/\/www.amazonlogistics-eu.com\/comp\/associateReturn/.test(url)) { // update status page
	var buttons = d.getElementsByTagName("button");
	var dest = d.getElementById("feedback_form");
	dest.insertBefore(buttons[0], dest.childNodes[0]);
}

if (/^http[s]:\/\/www.amazonlogistics-eu.com(|\/mn)\/comp\/shipmentDetail/.test(url)) { //beginning of shipment details bucket

//buttons
makeDetailsButton("View Order In CSC",document.getElementsByTagName("h2")[5],gotoOrder);
makeDetailsButton("GeoData Tool",document.getElementsByTagName("h2")[5],gotoGeoDataTool);
makeDetailsButton("Routing Tool",document.getElementsByTagName("h2")[5],gotoRoutingTool);
makeDetailsButton("Compare Geo to Address",document.getElementsByTagName("h2")[5],compareGeoToAddress);

var today = dateFunction(0);
var yesterday = dateFunction(-1);
var twodaysago = dateFunction(-2);
var table = window.content.document.getElementsByClassName("tableBody");


//modifies text with color to identify when packages were scanned
for (t=1; t<table.length; t++) {
	var tr = table[t].childNodes;
	var patt = new RegExp(today,'g');
	var patt2 = new RegExp(yesterday, 'g');
	var patt3 = new RegExp(twodaysago, 'g');
	
	for (i=0; i<tr.length; i++) {
		if (patt.test(tr[i].innerHTML)) {
			tr[i].style = "color:green";
			}
		if (patt2.test(tr[i].innerHTML)) {
			tr[i].style = "color:blue";
			}
		if (patt3.test(tr[i].innerHTML)) {
			tr[i].style = "color:red";
			}
		}
  }


//compare scan to geocode
var tr = table[1].childNodes;
var tableHeaders = window.content.document.getElementsByTagName("thead")[2];
var thCells = tableHeaders.childNodes[1].childNodes;
var detailTable = window.content.document.getElementById("ShipmentDetailTable");
var addrLat = detailTable.childNodes[1].childNodes[13].childNodes[7];
var addrLong = detailTable.childNodes[1].childNodes[13].childNodes[11];
	
if (/longitude/g.test(tableHeaders.innerHTML)) {
	for (col=1; col<thCells.length; col=col+2) {
		var cell = thCells[col].innerHTML;
		if (/longitude/g.test(cell)) {
			break;
			}
		}
	
	for (row=1; row<tr.length; row=row+2) {
		var td = tr[row].childNodes;
		if (td[col].innerHTML !== "&nbsp;") {
			var lat = td[col-2].innerHTML;
			var long = td[col].innerHTML;

			var attr1 = document.createElement("a");
			attr1.text = lat;
			attr1.href = "https://www.google.com/maps/dir/" + lat + " " + long + "/" + addrLat.innerHTML + " " +addrLong.innerHTML;

			var attr2 = document.createElement("a");
			attr2.text = long;
			attr2.href = "https://www.google.com/maps/dir/" + lat + " " + long + "/" + addrLat.innerHTML + " " +addrLong.innerHTML;

			td[col-2].innerHTML = "";
			td[col-2].appendChild(attr1);
			td[col].innerHTML = "";
			td[col].appendChild(attr2);
		  }
	  }
  }


//compare address to geocode
var addr = detailTable.childNodes[1].childNodes[17].childNodes[11];
if (addr.innerHTML.length > 0) {
	var zipStart = detailTable.childNodes[1].childNodes[21].childNodes[11].innerHTML.indexOf("(")+1;
	var zipEnd = detailTable.childNodes[1].childNodes[21].childNodes[11].innerHTML.indexOf(")");
	var zip = detailTable.childNodes[1].childNodes[21].childNodes[11].innerHTML.substr(zipStart, (zipEnd-zipStart));
	var attr1 = document.createElement("a");
	attr1.text = addr.innerHTML;
	attr1.href = "https://www.google.com/maps/dir/" + addrLat.innerHTML + " " + addrLong.innerHTML + "/" + addr.innerHTML + " " + zip;
	addr.innerHTML = "";
  addr.appendChild(attr1);
  }


//view address
if (addrLat.innerHTML.length > 0) {
	var attr1 = document.createElement("a");
	attr1.text = addrLat.innerHTML;
	attr1.href = "https://www.google.com/maps/search/" + addrLat.innerHTML + " " + addrLong.innerHTML;
	addrLat.innerHTML = "";
	addrLat.appendChild(attr1);
	
	var attr2 = document.createElement("a");
	attr2.text = addrLong.innerHTML;
	attr2.href = "https://www.google.com/maps/search/" + addrLat.innerHTML + " " + addrLong.innerHTML;
	addrLong.innerHTML = "";
	addrLong.appendChild(attr2);
  }


//view in CSC
var orderID = detailTable.childNodes[1].childNodes[21].childNodes[7];
var trackingID = detailTable.childNodes[1].childNodes[1].childNodes[3];

if (orderID.innerHTML.length > 0) {
	var attr1 = document.createElement("a");
	attr1.text = orderID.innerHTML;
	
	if (/Q/.test(trackingID.innerHTML)) {
		attr1.href = "https://cscentral-eu.amazon.com/gp/stores/www.amazon.co.uk/gp/order/detail/?ie=UTF8&orderID=" + orderID.innerHTML;
	  }
        if (/H/.test(trackingID.innerHTML)) {
		attr1.href = "https://cscentral-eu.amazon.com/gp/stores/www.amazon.co.uk/gp/order/detail/?ie=UTF8&orderID=" + orderID.innerHTML;
	  }
        if (/A/.test(trackingID.innerHTML)) {
		attr1.href = "https://cscentral-eu.amazon.com/gp/stores/www.amazon.co.uk/gp/order/detail/?ie=UTF8&orderID=" + orderID.innerHTML;
	  } 
	orderID.innerHTML = "";
	orderID.appendChild(attr1);
	}


//view in GeoData Tool
var trackingID = detailTable.childNodes[1].childNodes[1].childNodes[3];
if (trackingID.innerHTML.length > 0) {
	
  }

//convert metric to standard
var standardRow = document.getElementById("ec_table").childNodes[3];
var metricRow = standardRow.cloneNode(true);
document.getElementById("ec_table").appendChild(metricRow);
var metricRow = document.getElementById("ec_table").childNodes[5].childNodes[1];
metricRow.className = 'even';
metricRow.onmouseout = function() {
	this.className = 'even';
  };
	
var weight = document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[1].innerHTML;
var length = document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[3].innerHTML;
var width = document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[5].innerHTML;
var height = document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[7].innerHTML;
	
weight = Math.round(weight.replace(/(kg)|\(|\)/g,'')*2.20462*100)/100 + " (lb)";
document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[1].innerHTML = weight;

length = Math.round(length.replace(/(cm)|\(|\)/g,'')*0.393701*100)/100 + " (in)";
document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[3].innerHTML = length;
	
width = Math.round(width.replace(/(cm)|\(|\)/g,'')*0.393701*100)/100 + " (in)";
document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[5].innerHTML = width;
	
height = Math.round(height.replace(/(cm)|\(|\)/g,'')*0.393701*100)/100 + " (in)";
document.getElementById("ec_table").childNodes[3].childNodes[1].childNodes[7].innerHTML = height;

	
} //end of shipment details bucket

if (/^http[s]:\/\/www.amazonlogistics-eu.com(|\/mn)\/comp\/packageSearch/.test(url)) { //Begin Package Search bucket
	
	//filter Other
	var inputOther = document.createElement("input");
	inputOther.type="button";
	inputOther.value="Hide Other";
	inputOther.onclick = hideOther;
	inputOther.setAttribute("style", "font-size:12px;");
	document.getElementById("ShipmentSearchTable").insertBefore(inputOther, document.getElementById("ShipmentSearchTable").childNodes[1]);
	
	//filter BC
	var inputBC = document.createElement("input");
	inputBC.type="button";
	inputBC.value="Hide Business_Closed";
	inputBC.onclick = hideBC;
	inputBC.setAttribute("style", "font-size:12px;");
	document.getElementById("ShipmentSearchTable").insertBefore(inputBC, document.getElementById("ShipmentSearchTable").childNodes[1]);
  
	//filter Missing
	var inputMS = document.createElement("input");
	inputMS.type="button";
	inputMS.value="Hide Items Missing";
	inputMS.onclick = hideMissing;
	inputMS.setAttribute("style", "font-size:12px;");
	document.getElementById("ShipmentSearchTable").insertBefore(inputMS, document.getElementById("ShipmentSearchTable").childNodes[1]);
  
	//Hide All
	var inputAll = document.createElement("input");
	inputAll.type="button";
	inputAll.value="Hide All";
	inputAll.onclick = hideAll;
	inputAll.setAttribute("style", "font-size:12px;");
	inputAll.style.fontWeight = "900";
	document.getElementById("ShipmentSearchTable").insertBefore(inputAll, document.getElementById("ShipmentSearchTable").childNodes[1]);
  
	//Reset on Search
	var searchBtn = document.getElementById("searchSubmit");
	searchBtn.addEventListener("click", searchReset);
	
  } //End package search bucket

if (/^http[s]:\/\/www.amazonlogistics-eu.com(|\/mn)\/comp\/associateReturn/.test(url)) { //Begin Update Status page
	var batchTable = d.createElement("table");
	
  } // end Update Status bucket

'allow pasting'
