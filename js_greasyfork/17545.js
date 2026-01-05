// ==UserScript==
// @name        UOB_Schedule_Organizer
// @version     1.1
// @description This userscript provide readable schedule for Univirsity Of Bahrain (UOB) students beside orginal schedule, and view available seats in course schedule page.
// @copyright   2016+, Ali Yusuf
// @icon        http://www.online.uob.edu.bh/favicon.ico
// @namespace   https://greasyfork.org/users/32205
// @include     https://www.online.uob.edu.bh/cgi/regweb/schedule_page_print
// @include     http://www.online.uob.edu.bh/cgi/regweb/schedule_page_print
// @include     https://www.online.uob.edu.bh/cgi/enr/schedule2.class_schedule?*
// @include     http://www.online.uob.edu.bh/cgi/enr/schedule2.class_schedule?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17545/UOB_Schedule_Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/17545/UOB_Schedule_Organizer.meta.js
// ==/UserScript==

// Load script function needed to make sure that script is loaded before execute the code
function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

// Check window path to run the appropriate function
// 1) Schedule Organizer
// 2) Avilable Seat Viewr
if (window.location.pathname == '/cgi/regweb/schedule_page_print')
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js", function(){
        PrintSchedule ();
    });
else if (window.location.pathname == '/cgi/enr/schedule2.class_schedule')
    loadScript('https://code.jquery.com/jquery-1.12.0.min.js', function(){
        ViewSeats ();
    });
else
    alert("Sorry this page are not supported :)\n-Ali Yusuf");

/***************************************************************************************************************************
//
//
//   1) Schedule Organizer code
//
//
//**************************************************************************************************************************/


/*
- stuctur of subjects[subjectKey[]]:
[
	index 0 ->"subjectName",
	index 1 ->"section",
	index 2 ->"credit",
	index 3 ->"finalExam",
	index 4 ->"timing": [
			index 0 ->{
			"Day":"",
			"from":"",
			"to":"",
			"room":"",
			"site":""
		},
        index 1 ->{..}, ..
    ]
]
*/

function PrintSchedule (){
    var title = '<a href="https://goo.gl/1Xo9c3" target="_blank" >USO</a> - v1.1';
    var days = ['U','M','T','W','H'];
    var hours = [];
    for (i=8;i<20;i+=0.25)
        hours.push(i);
    var subjects = {}; // contain all information of subjects
    var subjectsKey = []; // contain subjects keys
    var parentScheduleTable = document.body.getElementsByTagName('table')[4];
    var scheduleTable = document.body.getElementsByTagName('table')[5];
    var tbody = scheduleTable.getElementsByTagName('tbody')[0];
    var rows = tbody.children;
    var colors = ['aquamarine','bisque','gainsboro','gold','lightblue','greenyellow','khaki','lightgrey','palegoldenrod','pink','plum','sandybrown','tan'];
    
    // Get course information
    
    for (i=0;i<rows.length;i++)
    {
        if (!rows[i].children[0].hasAttribute('colspan'))
        {
            var subject = rows[i].children[0].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
            if (subject != "&nbsp;")
            {
                if (subjectsKey.length>0)
                    subjects[subjectsKey[subjectsKey.length-1]].push(timing);
                
                subject += rows[i].children[1].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                var section = rows[i].children[3].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                var subjectName = rows[i].children[4].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                var credit = rows[i].children[10].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                var finalExam = rows[i].children[11].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                subjects[subject]= [subjectName,section,credit,finalExam];
                subjectsKey.push(subject);
                var timing = [];
            }
            else if (subjectsKey[subjectsKey.length-1] !== '')
            {
                var timingTemp = {};
                timingTemp.day = rows[i].children[5].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                timingTemp.from = rows[i].children[6].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                timingTemp.to = rows[i].children[7].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                timingTemp.room = rows[i].children[8].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                timingTemp.site = rows[i].children[9].innerHTML.replace(/(\s*<\/?font.*?>\s*)/g, "");
                timing.push(timingTemp);
            }
        }
    }
    if (subjectsKey.length>0)
        subjects[subjectsKey[subjectsKey.length-1]].push(timing);
    
    // Build newTable String
    
    var newTable = '<table id="newTable" width="800" border="0" align="center" cellpadding="0" cellspacing="0" bordercolor="#000000">\n  <tbody><tr>\n    <td>\n	<table width="100%" style="border-collapse: collapse;" cellspacing="0" cellpadding="0" bgcolor="#fff">\n		<tbody>\n			<tr height="60" align="center">\n				<td colspan="80" align="center" id="title" >'+title+'<br><br></td>\n			</tr>\n			<tr align="center" style="border-bottom:1pt solid black;">\n				<td><font size="4" face="Times New Roman"><b></b></font></td>\n';
    for (i=0;i<hours.length;i+=4){
        if (hours[i]>7 && hours[i]<12)
            newTable += '				<td style="border:1pt solid;background: whitesmoke;" colspan="4" ><font size="4" face="Times New Roman"><b><nobr>'+hours[i]+' AM</nobr></b></font></td>\n';
        else
        {
            var h = (hours[i] > 12) ? (hours[i]-12):(12);
            newTable += '				<td style="border:1pt solid;background: whitesmoke;" colspan="4" ><font size="4" face="Times New Roman"><b><nobr>'+h+' PM</nobr></b></font></td>\n';
        }
    }
    newTable += '			</tr>\n';
    for (i=0;i<days.length;i++)
    {
        newTable += '			<tr style="border-bottom:1pt solid black;" align="center">\n				<td style="border-bottom: 1pt solid;border-left: 1pt solid;background: whitesmoke;" height="30" ><font style="font-size:40px" face="Times New Roman">'+days[i]+'</font></td>\n';
        for (j=0;j<hours.length;j++)
            if(hours[j]%1===0)
            newTable += '				<td style="border-left:1pt solid;" id="'+days[i]+'-'+hours[j]+'"></td>\n';
            else if(j==hours.length-1)
            newTable += '				<td style="border-right:1pt solid;" id="'+days[i]+'-'+hours[j]+'"></td>\n';
            
            else
                newTable += '				<td id="'+days[i]+'-'+hours[j]+'"></td>\n';
        newTable += '			</tr>\n';
    }
    newTable += '			<tr height="40"></tr>\n		</tbody>\n	</table>\n	</td>\n  </tr>\n</tbody></table>';
    
    // Add newTable to document
    
    var parser = new DOMParser();
    newTable = parser.parseFromString(newTable, "text/html");
    //document.body.insertBefore(newTable.body.childNodes[0],parentScheduleTable.nextSibling);
    
    for (i=0;i<subjectsKey.length;i++)
    {
        for (k=0;k<subjects[subjectsKey[i]][4].length;k++)
            for (d=0;d<days.length;d++)
                if (subjects[subjectsKey[i]][4][k]['day'].search(days[d]) !== -1)
                    {
                        var fTime = subjects[subjectsKey[i]][4][k].from.match(/([\d]*):([\d]*)/);
                        var fHour = parseInt(fTime[1]);
                        var fMin = parseInt(fTime[2]);
                        var tTime = subjects[subjectsKey[i]][4][k].to.match(/([\d]*):([\d]*)/);
                        var tHour = parseInt(tTime[1]);
                        var tMin = parseInt(tTime[2]);

                        newTable.getElementById(days[d]+'-'+(fHour+(fMin/60))).innerHTML += subjectsKey[i]+'<br>'+subjects[subjectsKey[i]][4][k].room+'<br>Sec.'+subjects[subjectsKey[i]][1];
                        
                        var span = (tHour*60+tMin) - (fHour*60+fMin);
                           
                        if (span == 50)
                            span = 60;
                        else if (span == 100)
                            span = 105;
                            
                        var node = newTable.getElementById(days[d]+'-'+(fHour+(fMin/60)));
                        node.setAttribute("colspan", span/15);
                        node.setAttribute("style",'border-right:1pt solid; border-left:1pt solid;border-bottom:1pt solid; background: '+colors[i]+';');
                        
                        if (span == 60)
                            span = 45;
                        else if (span == 75)
                            span = 60;
                        else if (span == 105)
                            span = 90;
                        
                        for (r=0;r<span/15;r++)
                            node.parentNode.removeChild(newTable.getElementById(days[d]+'-'+((fHour+(fMin/60))+((r+1)/4))));
                    }
    }
    document.body.insertBefore(newTable.body.childNodes[0],parentScheduleTable.nextSibling);
    html2canvas(document.getElementById("newTable"), {  
        onrendered: function (canvas) {
            var dataUrl = canvas.toDataURL();
            document.getElementById("title").innerHTML+='<a href="'+dataUrl+'" target="_blank" style="color: inherit; text-decoration: inherit; text-decoration: none;background-color: #EEEEEE;color: #333333;padding: 2px 6px 4px 6px;border-top: 1px solid #CCCCCC;border-right: 1px solid #333333;border-bottom: 1px solid #333333;border-left: 1px solid #CCCCCC;" id="saveTable">Save Table As photo</a><br><br>';
        }
    });
}

/*
    - Tests:
    console.log();
    console.log(subjects);         //Test subjects
    console.log(subjectsKey);      //Test subjectsKey
    console.log(newTable);    //Test newTable
*/

/***************************************************************************************************************************
//
//
//   2) Available Seate Viewer code
//
//
//**************************************************************************************************************************/

function ViewSeats (){
    document.getElementsByTagName('frame')[0].setAttribute("id", "bannerFrame");
    document.getElementsByTagName('frame')[3].setAttribute("id", "mainFrame");
    var bannerFrame = top.frames.banner;
    var mainFrame = top.frames.main;
    var header = bannerFrame.document.querySelector('body > p');
    header.firstElementChild.innerHTML = '<font color="#000000" size="4"> Course Schedule With Available Seats - <a href="https://goo.gl/1Xo9c3" target="_blank">USO</a></font><br>';
    
    // Main frame load listener
    $('#mainFrame').load(function() {
        var inl_s = mainFrame.location.search.search('inl=');
        var crsno_s = mainFrame.location.search.search('crsno=');
        var crd_s = mainFrame.location.search.search('crd=');
        var inl = mainFrame.location.search.substring(inl_s+4,crsno_s-1);
        var crsno = mainFrame.location.search.substring(crsno_s+6,crd_s-1);
        
        // Set Seates to N/A
        var elements = mainFrame.document.querySelectorAll('body > p');
        [].forEach.call(elements, function( el ) {
            var sec = />([0-9]{2})</gm.exec(el.firstElementChild.innerHTML);
            //console.log(sec[1]);
            var seatString = '<br><font color="#000080">Available Seats => </font><font id="secno_'+sec[1]+'" name="courseSeates" color="#FF0000">N/A</font>';
            el.firstElementChild.innerHTML = el.firstElementChild.innerHTML+seatString;
        });
        
        // Get info.
        $.get('https://www.online.uob.edu.bh/cgi/enr/enr_sections?pcrsnbr='+crsno+'&pcrsinlcde='+inl, function( data ) {
            //console.log(data);
            data = data.replace(/(\r\n|\n|\r)/gm,"");
            var sec = [];
            var seat = [];
            var match = [];
            // Sections info.
            var pattern = /color="#FF0000">([0-9]{2})</g;
            while (match = pattern.exec(data)) {
                sec.push(match[1]);
            }
            // Available seats info.
            pattern = /size="2">([0-9]*)</g;
            while (match = pattern.exec(data)) {
                seat.push(match[1]);
            }
            for(i=0;i<seat.length;i++)
            {
                $('#secno_'+sec[i],mainFrame.document).html(seat[i]);
            }
        }); // End get info.
        
    });// End main frame load listener
}