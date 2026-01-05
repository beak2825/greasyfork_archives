// ==UserScript==
// @name           abritas
// @version        9.0
// @namespace      kevin
// @include        https://dev-rhondda-008-000.abritas.local*
// @description    validate_script
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/11255/abritas.user.js
// @updateURL https://update.greasyfork.org/scripts/11255/abritas.meta.js
// ==/UserScript==

alert('script working?');

var changed = 0; // script need to be edited with

window.addEventListener('beforescriptexecute', function(e) {

    ///for external script:
	src = e.target.src;
	if (src.search(/validate.js/) != -1) {
                changed++;
		e.preventDefault();
		e.stopPropagation();
		append(NewScript1);
	};


    ///when done, remove the listener:
	if(changed == 2) window.removeEventListener(e.type, arguments.callee, true);

}, true);



////// append with new block function:
function append(s) {	 
      document.head.appendChild(document.createElement('script'))
             .innerHTML = s.toString().replace(/^function.*{|}$/g, '');
}

////////////////////////////////////////////////
function NewScript1(){
var ValidationString = '';
var UserObjectName = '';
var AllowedHTMLFields = '';


function objectName(objName)
{
  var sTemp = UserObjectName
  if (UserObjectName != '')
  {
    UserObjectName = '';
    return sTemp
  }
  else
  {

    return objName.name

  }
}
function checkDate (objName)
{
  return true;
}


function chkdate(objName)
{
 if (typeof objName == 'object'){

  //var strDatestyle = "US"; //United States date style
  var strDatestyle = "EU";  //European date style
  var strDate;
  var strDateArray;
  var strDay;
  var strMonth;
  var strYear;
  var intday;
  var intMonth;
  var intYear;
  var booFound = false;
  var datefield = objName;
  var strSeparatorArray = new Array("-","/");
  var intElementNr;
  var err = 0;
  var strMonthArray = new Array(12);
  strMonthArray[0] = "Jan";
  strMonthArray[1] = "Feb";
  strMonthArray[2] = "Mar";
  strMonthArray[3] = "Apr";
  strMonthArray[4] = "May";
  strMonthArray[5] = "Jun";
  strMonthArray[6] = "Jul";
  strMonthArray[7] = "Aug";
  strMonthArray[8] = "Sep";
  strMonthArray[9] = "Oct";
  strMonthArray[10] = "Nov";
  strMonthArray[11] = "Dec";
  strDate = datefield.value;

  if (strDate.length < 1)
  {
    return true;
  }

  for (intElementNr = 0; intElementNr < strSeparatorArray.length; intElementNr++)
  {
    if (strDate.indexOf(strSeparatorArray[intElementNr]) != -1)
    {
      strDateArray = strDate.split(strSeparatorArray[intElementNr]);

      if (strDateArray.length != 3)
      {
        err = 1;
        return false;
      }
      else
      {
        strDay = strDateArray[0];
        strMonth = strDateArray[1];
        strYear = strDateArray[2];
      }
      booFound = true;
    }
  }

  if (booFound == false)
  {
    //no delimiter in date, so error
    return false;
  }

  if (booFound == false)
  {
    if (strDate.length>5)
    {
      strDay = strDate.substr(0, 2);
      strMonth = strDate.substr(2, 2);
      strYear = strDate.substr(4);
    }
    else
    {
      return false;
    }
  }

  if (strYear.length == 2)
  {
    //removing this makes the user enter a 4 digit year
    //strYear = '20' + strYear;
    return false;
  }

  if (strYear.length == 3)
  {
    return false;
  }

  if (strYear.length > 4)
  {
      return false;
  }

  if (strMonth.length > 2) {
      return false;
  }

  if (strDay.length > 2) {
      return false;
  }


  // US style
  if (strDatestyle == "US")
  {
    strTemp = strDay;
    strDay = strMonth;
    strMonth = strTemp;
  }

  intday = ~~Number(strDay);
	if (strDay.toString() !== intday.toString() && strDay.toString() !== "0" + intday.toString())
  {
    err = 2;
    return false;
  }

  intMonth = ~~Number(strMonth);
  if (strMonth.toString() !== intMonth.toString() && strMonth.toString() !== "0" + intMonth.toString())
  {
		bValidMonth = false;
		
    for (i = 0;i<12;i++)
    {
      if (strMonth.toUpperCase() == strMonthArray[i].toUpperCase())
      {
        intMonth = i+1;
        strMonth = strMonthArray[i];
        i = 12;
				bValidMonth = true;
      }
    }

    if (bValidMonth == false)
    {
      err = 3;
      return false;
    }
  }

  intYear = ~~Number(strYear);
  if (strYear.toString() !== intYear.toString() && strYear.toString() !== "0" + intYear.toString())
  {
    err = 4;
    return false;
  }

  if (intYear < 1753)
  {
    err = 11;
    return false
  }

  if (intYear > 9999)
  {
    err = 12;
    return false
  }

  if (intMonth>12 || intMonth<1)
  {
    err = 5;
    return false;
  }

  if ((intMonth == 1 || intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12) && (intday > 31 || intday < 1))
  {
    err = 6;
    return false;
  }

  if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intday > 30 || intday < 1))
  {
    err = 7;
    return false;
  }

  if (intMonth == 2)
  {
    if (intday < 1)
    {
      err = 8;
      return false;
    }

    if (LeapYear(intYear) == true)
    {
      if (intday > 29)
      {
        err = 9;
        return false;
      }
    }
    else
    {
      if (intday > 28)
      {
        err = 10;
        return false;
      }
    }
  }
 }
  return true;
}

function LeapYear(intYear)
{
  if (intYear % 100 == 0)
  {
    if (intYear % 400 == 0) { return true; }
  }
  else
  {
    if ((intYear % 4) == 0) { return true; }
  }

  return false;
}

function doDateCheck(from, to)
{
 if (typeof from == 'object' && to == 'object'){
  if (Date.parse(from.value) <= Date.parse(to.value))
  {
    alert("The dates are valid.");
  }
  else
  {
    if (from.value == "" || to.value == "")
    {
      alert("Both dates must be entered.");
    }
    else
    {
      alert("To date must occur after the from date.");
    }
  }
 }
}

function first (objName)
{

 if (typeof objName == 'object'){

  if (objName == null) return (false);
  if (objName.disabled) return (false);

  //alert(objectName(objName) + " si=" + objName.selectedIndex + " length=" + objName.length);
  if (objName.selectedIndex <= 0 && ValidationString.indexOf('|' + objName.name + '|') == -1) {
    alert("The first " + objectName(objName) + " option is not a valid selection.  Please choose one of the other options.");
    objName.focus();
    return (true);

  }
  /*
  else if(objName.selectedIndex == 0) {

  alert("The first " + objectName(objName) + " option is not a valid selection.  Please choose one of the other options.");
  objName.focus();
  return (true);
  }
  */
  else if(!objName.selectedIndex && ValidationString.indexOf('|' + objName.name + '|') == -1) {

    for (i=0; i<objName.length; i++) {
      //alert(objName[i].name + "=" + objName[i].value);
      if(objName[i].checked == true) return false;
    }
    // if we get this far, none of radio buttons were selected so alert user to the error
    if (objName.length > 0) {
    	if (document.getElementById(objName[0].name) != null) {
    	  alert("Please choose one of the options for " + objectName(objName[0].name));
     	  document.getElementById(objName[0].name).focus();
     	  return (true);
     	}
     	else {
     	  return (false);
     	}
    }
    else {
    	return (false);
    }

  }
 }
  return (false)
}

function present (objName)
{
  if (typeof objName == 'object') {

    if (objName == null) return (true);
    if (objName.disabled) return (true);

    if(objName.name) //multiple select list box, single select, text field
    {

      if (objName.length) //a multiple select list box will return a length
      {
        if(objName.value.length > 0)
        {
          return(true);
        }
        else
        {
          // if we get here it hasn't returned true ie items were not selected
          alert("Please enter a value in the " + objectName(objName.name) + " field.");
          document.getElementById(objName.name).focus();
          return (false);
        }
      }
      else  //single select or text fields will not return a length so handle them here
      {
        //i.e field is empty and it is not in the list of NonMandatory Items
        //this  is inicated by the -1
        if (objName.value == "" && ValidationString.indexOf('|' + objName.name + '|') == -1 )
        {
          alert("Please enter a value in the " + objectName(objName) + " field.");
          objName.focus();
          return (false);
        }
      }
    }
    else //check boxes & radio buttons will not return a name so handle them here
    {

      for (i=0; i<objName.length; i++) {
        if(objName[i].checked == true) return true;
      }
      // if we get here it hasn't returned true ie no boxes were checked
      alert("Please enter a value in the " + objectName(objName[0].name) + " field.");
      document.getElementById(objName[0].name).focus();
      return (false);
    }

  }
  return true;
}

function presentNoWarning (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  if (objName.value == "")
  {
    objName.focus();
    return (false);
  }
 }
  return true;
}

function isInt (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  var checkOK = "0123456789-";
  var checkStr = objName.value;
  var allValid = true;
  var decPoints = 0;
  var allNum = "";

  for (i = 0;  i < checkStr.length;  i++)
  {
    ch = checkStr.charAt(i);
    for (j = 0;  j < checkOK.length;  j++)
      if (ch == checkOK.charAt(j))
        break;
    if (j == checkOK.length)
    {
      allValid = false;
      break;
    }
    allNum += ch;
  }
  if (!allValid)
  {
    alert("Please enter an integer value in the " + objectName(objName) + " field.");
    objName.focus();
    return (false);
  }
 }

  return (true);
}

function isPosIntNoAlert(objName) {
  if (typeof objName == 'object') {
    if (objName == null) return (true);
    if (objName.disabled) return (true);

    var checkOK = "0123456789";
    var checkStr = objName.value;
    var allValid = true;
    var decPoints = 0;
    var allNum = "";

    for (i = 0; i < checkStr.length; i++) {
      ch = checkStr.charAt(i);
      for (j = 0; j < checkOK.length; j++)
        if (ch == checkOK.charAt(j))
          break;
      if (j == checkOK.length) {
        allValid = false;
        break;
      }
      allNum += ch;
    }
    if (!allValid) {
      return (false);
    }
  }

  return (true);
}



function checkTime (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  if (!chktime(objName))
  {
    alert("Please enter a valid time in the " + objectName(objName) + " field.");
    objName.focus();
    return false;
  }
 }
  return true;
}


function chktime(objName)
{
 if (typeof objName == 'object'){
  // Time validation function courtesty of
  // Sandeep V. Tamhankar (stamhankar@hotmail.com) -->

  // Checks if time is in HH:MM:SS AM/PM format.
  // The seconds and AM/PM are optional.

  var timefield = objName;
  var timePat = /^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/;
  var timeStr

  timeStr = timefield.value;

  if (timeStr.length < 1)
  {
    return true;
  }

  var matchArray = timeStr.match(timePat);
  if (matchArray == null)

  {
    return false;
  }

  hour = matchArray[1];
  minute = matchArray[2];
  second = matchArray[4];
  ampm = matchArray[6];

  if (second=="") { second = null; }
  if (ampm=="") { ampm = null }

  if (hour < 0  || hour > 23)
  {
    return false;
  }

  if  (hour > 12 && ampm != null)
  {
    return false;
  }

  if (minute < 0 || minute > 59)
  {
    return false;
  }

  if (second != null && (second < 0 || second > 59))
  {
    return false;
  }
 }
  return true;
}

function checkMaxLength (objName, iMaxLength)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  if (objName.value.length > iMaxLength)
  {
    alert("Please enter at most " + iMaxLength + " characters in the " + objectName(objName) + " field.");
    objName.focus();
    return (false);
  }
 }
  return true;
}

function isNumber(objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  var checkOK = "0123456789.-";
  var checkStr = objName.value;
  var allValid = true;
  var validGroups = true;
  var decPoints = 0;
  var allNum = "";


  for (i = 0;  i < String(checkStr).length;  i++)
  {
    ch = checkStr.charAt(i);
    for (j = 0;  j < checkOK.length;  j++)
      if (ch == checkOK.charAt(j))
        break;
    if (j == checkOK.length)
    {
      allValid = false;
      break;
    }
    if (ch == ".")
    {
        if (String(checkStr).length == 1) {
            validGroups = false;
            break;
        } 
        else {
            allNum += ".";
            decPoints++;
        }
    }
    else if (ch == "," && decPoints != 0)
    {
      validGroups = false;
      break;
    }
    else if (ch == "-" && (i != 0 || String(checkStr).length == 1)) {
      validGroups = false;
      break;
    }
    else if (ch != ",")
      allNum += ch;
  }
  if (!allValid)
  {
    alert("Please enter only digit characters in the " + objectName(objName) + " field.");
    objName.focus();
    return (false);
  }

  if (decPoints > 1 || !validGroups)
  {
    alert("Please enter a valid number in the " + objectName(objName) + " field.");
    objName.focus();
    return (false);
  }
 }
  return (true);
}

function isDateABeforeDateB(strDateA,strDateB){
//assumes in dd/mm/yyyy format - guaranteed by Check Date Function

  var sDayA = parseInt(strDateA.substring(0,2), 10);
  var sDayB = parseInt(strDateB.substring(0, 2), 10);
  //Need to subtract 1 as months run from 0-11
  var sMonthA = parseInt(strDateA.substring(3,5), 10) - 1;
  var sMonthB = parseInt(strDateB.substring(3,5), 10) - 1;
  var sYearA = parseInt(strDateA.substring(6,10), 10);
  var sYearB = parseInt(strDateB.substring(6,10), 10);
  var dteA = new Date(sYearA, sMonthA, sDayA,0,0,0);
  var dteB = new Date(sYearB, sMonthB, sDayB,0,0,0);


  if(dteB.valueOf() - dteA.valueOf() > 0){
    return true;}
   else{
    return false;
    }
}

function isNaturalNumber(objName)
{
 if (typeof objName == 'object'){
  // Checks that the input is an integer greater than zero

  if (objName == null) return true;
  if (objName.disabled) return true;

  var naturalNumber = /^\s*([1-9]+[0-9]*)*\s*$/;
  var oInput = objName;
  var sInput = oInput.value;
  var matchArray = sInput.match(naturalNumber);
  if (matchArray == null) {
    alert("Please enter a valid number in the " + objectName(objName) + " field.");
    objName.focus();
    return false;
  }
 }
  return true;
}


function isPosInt (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  var checkOK = "0123456789";
  var checkStr = objName.value;
  var allValid = true;
  var decPoints = 0;
  var allNum = "";

  for (i = 0;  i < checkStr.length;  i++)
  {
    ch = checkStr.charAt(i);
    for (j = 0;  j < checkOK.length;  j++)
      if (ch == checkOK.charAt(j))
        break;
    if (j == checkOK.length)
    {
      allValid = false;
      break;
    }
    allNum += ch;
  }
  if (!allValid)
  {
    alert("Please enter a positive non-decimal integer value in the " + objectName(objName) + " field.");
    objName.focus();
    return (false);
  }
 }
  return (true);
}



function isMoney (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  var checkOK = "0123456789.";
  var checkStr = objName.value;
  var allValid = true;
  var decPoints = "00";
  var decPointChar = ".";
  var decPointPresent = false;
  var allNum = "";

  for (i = 0;  i < checkStr.length;  i++)
  {
    ch = checkStr.charAt(i);

    if (ch == decPointChar)
    {
      //if already found then must be wrong so exit
      if (decPointPresent)
      {
        allValid = false;
        break;
      }
      decPointPresent = true;
    }

    for (j = 0;  j < checkOK.length;  j++)
      if (ch == checkOK.charAt(j))
        break;
    if (j == checkOK.length)
    {
      allValid = false;
      break;
    }
    allNum += ch;
  }


  //now need to check to make sure that the decimal point is at the right point
  if (allValid)
  {
    if (decPointPresent)
    {
      var decPos = checkStr.lastIndexOf(decPointChar);
      //alert(checkStr.length - decPos);
      if ((checkStr.length - decPos) > (decPoints.length + 1))
      {
        allValid = false;
      }
    }
  }



  if (!allValid)
  {
    alert("Please enter a valid money value in the " + objectName(objName) + " field.");
    objName.focus();
    return (false);
  }
 }
  return (true);
}

function isMoneyPosNeg (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  var checkOK = "0123456789.-";
  var checkStr = objName.value;
  var allValid = true;
  var decPoints = "00";
  var decPointChar = ".";
  var decPointPresent = false;
  var allNum = "";

  for (i = 0;  i < checkStr.length;  i++)
  {
    ch = checkStr.charAt(i);

    if (ch == decPointChar)
    {
      //if already found then must be wrong so exit
      if (decPointPresent)
      {
        allValid = false;
        break;
      }
      decPointPresent = true;
    }

    for (j = 0;  j < checkOK.length;  j++)
      if (ch == checkOK.charAt(j))
        break;
    if (j == checkOK.length)
    {
      allValid = false;
      break;
    }
    allNum += ch;
  }


  //now need to check to make sure that the decimal point is at the right point
  if (allValid)
  {
    if (decPointPresent)
    {
      var decPos = checkStr.lastIndexOf(decPointChar);
      //alert(checkStr.length - decPos);
      if ((checkStr.length - decPos) > (decPoints.length + 1))
      {
        allValid = false;
      }
    }
  }



  if (!allValid)
  {
    alert("Please enter a valid money value in the " + objectName(objName) + " field.");
    objName.focus();
    return (false);
  }
 }
  return (true);
}


function PresentNotEmpty (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  if (objName.value != "")
  {
    return 'Yes';
  }
 }
  return 'No';
}


function fieldExists (objName)
{
 if (typeof objName == 'object'){
  if (objName == null) return (true);
  if (objName.disabled) return (true);

  return true;
 }
 else{
  return false;
 }
}



function isObject(a) {
  return (a && typeof a == 'object');
}



function formatAsMoney(mnt)
{
  mnt -= 0;
  mnt = (Math.round(mnt*100))/100;
  return (mnt == Math.floor(mnt)) ? mnt + '.00'
      : ( (mnt*10 == Math.floor(mnt*10)) ?
         mnt + '0' : mnt);
}



function GetDateFromString(strDate)
{

  var strDay;
  var strMonth;
  var strYear;
  var strSeparatorArray = new Array("-"," ","/",".");
  var intElementNr;


  for (intElementNr = 0; intElementNr < strSeparatorArray.length; intElementNr++)
  {
    if (strDate.indexOf(strSeparatorArray[intElementNr]) != -1)
    {
      strDateArray = strDate.split(strSeparatorArray[intElementNr]);

      if (strDateArray.length != 3)
      {
        return false;
      }
      else
      {
        strDay = strDateArray[0];
        strMonth = strDateArray[1];
        strYear = strDateArray[2];
      }
    }
  }
  //alert(strDay);
  //alert(strMonth);
  //alert(strYear);

  var d = new Date(strYear, strMonth - 1, strDay);
  return d;
}






function daysElapsed(date1,date2)
{
  var difference = Date.UTC(date1.getYear(),date1.getMonth(),date1.getDate(),0,0,0) - Date.UTC(date2.getYear(),date2.getMonth(),date2.getDate(),0,0,0);
  return difference/1000/60/60/24;
}

function formatDate(d)
{
  var weekday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")
  var monthname=new Array("January","February","March","April","May","June","July","August","September","October","November","December")

  return weekday[d.getDay()] + " " + d.getDate() + numericPlacementSuffix(d.getDate()) + " " + monthname[d.getMonth()] + " " + d.getFullYear()

}


function numericPlacementSuffix(dayNumber)
{
  var sTemp = String(dayNumber)
  var sSuffix

  var num=parseInt (sTemp.charAt(sTemp.length - 1), 10);

  switch (num)
  {
  case 1:
    sSuffix = 'st'
    break
  case 2:
    sSuffix = 'nd'
    break
  case 3:
    sSuffix = 'rd'
    break
  default:
    sSuffix = 'th'
  }

  return sSuffix
}


function checkForHTML () {
return false;
}
};