// ==UserScript==
// @name           osu! mp Exporter
// @description    Export Multiplay result as csv
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        https://osu.ppy.sh/mp/*
// @include        http://osu.ppy.sh/mp/*
// @require        http://code.jquery.com/jquery-1.11.1.min.js
// @copyright      2014, Jeb
// @version        0.1.0.7
// @namespace https://greasyfork.org/users/3079
// @downloadURL https://update.greasyfork.org/scripts/3274/osu%21%20mp%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/3274/osu%21%20mp%20Exporter.meta.js
// ==/UserScript==


function exportToCSV(filename) {
    csvData="";
    a={};
    $('table').each(function(){
        var $rows = $(this).find('tr:has(td,th)');
        csv="";
        $(this).parent(0).parent(0).find('div').each(function(){
            if (
                (typeof($(this).attr('class'))=="undefined")
                && 
                (typeof($(this).attr('style'))=="undefined")
            ){
                csv = csv + '"' + $(this).text() + '"' + "\n" ;
            }if (
                ($(this).attr('class')=="maintext")
            ){
                csv = csv + $(this).text() + "" ;
            }
        });
        tmpColDelim = String.fromCharCode(11),
            tmpRowDelim = String.fromCharCode(0),
                colDelim2 = '","',
                    rowDelim2 = '"\n"',
                        d = $rows.map(function (i, row) {
                            var $row = $(row),
                                $cols = $row.find('td,th');
                            return $cols.map(function (j, col) {
                                var $col = $(col),
                                    text = $col.text();
                                return text.replace('"', '""');
                            }).get().join(tmpColDelim);
                        }).get().join(rowDelim2).split(tmpColDelim).join(colDelim2) + '"';
        csv = csv + '"' + d;
        colDelim = '","',
            rowDelim = '"],\n["',
                e = '[["' + $rows.map(function (i, row) {
                    var $row = $(row),
                        $cols = $row.find('td');
                    return $cols.map(function (j, col) {
                        var $col = $(col),
                            text = $col.text();
                        return text.replace('"', '""');
                    }).get().join(tmpColDelim);
                }).get().join(rowDelim+'')
                .split(tmpColDelim).join(colDelim) + '"]]';
        j = eval('('+e+')');
        j.shift();
        x = j.sort(function(a,b){return b[1].replace(/[^0-9]/g,"")-a[1].replace(/[^0-9]/g,"")});
        for(i in x){
            if (typeof(a[x[i][3]])=='undefined')
                a[x[i][3]]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            a[x[i][3]][parseInt(i)+1]++;
            a[x[i][3]][0]+=parseInt(x[i][1].replace(/[^0-9]/g,""));
        }
        
        csvData = csvData + encodeURIComponent(csv + "\n"+ "\n") ;
    });
    csvData = csvData + encodeURIComponent("\n"+ "\n") ;
    csvData = csvData + encodeURIComponent('"Name","Total Score"') ;
    for(o=1;o<=16;o++)
        csvData = csvData + encodeURIComponent(',"#'+o.toString()+'"') ;
    for(i in a){
        csvData = csvData + encodeURIComponent("\n"+'"'+i+'","'+a[i][0].toString()+'"') ;
        for(o=1;o<=16;o++)
            csvData = csvData + encodeURIComponent(',"'+a[i][o].toString()+'"') ;
    }
    $(this)
    .attr({
        'download': filename,
        'href': 'data:application/csv;charset=utf-8,%EF%BB%BF' + csvData,
        'target': '_blank'
    });
    
}
$('.mphistory').prepend('<center><a class="export" style="text-decoration: none;color:#000;background-color:#ddd; border: 1px solid #ccc; padding:8px;" target="_blank">Export Table data into csv</a></center>');

$(".export").on('click', function (event) {
    exportToCSV.apply(this, ['export.csv']);
});