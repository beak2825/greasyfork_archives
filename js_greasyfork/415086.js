// ==UserScript==
// @name         pso2 catalog2table
// @name-jp      PSO2 スクラッチカタログのメモシート化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  スク品のメモ蝶とワンクリックでアイテム名コピー
// @author       You
// @match        http://pso2.jp/players/catalog/scratch/ac/*/
// @match        http://pso2.jp/players/catalog/scratch/gold/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415086/pso2%20catalog2table.user.js
// @updateURL https://update.greasyfork.org/scripts/415086/pso2%20catalog2table.meta.js
// ==/UserScript==

var isgold = !!~document.URL.indexOf('scratch/gold/');
var keyword = isgold ? 'gold/' : 'ac/';
var catalogid = document.URL.split(keyword)[1].split('/')[0];
if(isgold)catalogid = 'gold'+catalogid;

//build page
//button to toggle table display
var mbtoggletable = createbutton('☨表召喚☨');
mbtoggletable.addEventListener('click',toggletable);
mbtoggletable.style.width = 'auto';
mbtoggletable.style.position = 'fixed';
mbtoggletable.style.top = '0px';
mbtoggletable.style.right = '10px';
mbtoggletable.style.zIndex = '10001';
document.body.appendChild(mbtoggletable);

var mbexport = createbutton('export');
mbexport.addEventListener('click',converttotext);
mbexport.style.width = 'auto';
mbexport.style.position = 'fixed';
mbexport.style.top = '20px';
mbexport.style.right = '10px';
mbexport.style.zIndex = '10001';
document.body.appendChild(mbexport);

var mbclear = createbutton('clear');
mbclear.addEventListener('click',clearprices);
mbclear.style.width = 'auto';
mbclear.style.position = 'fixed';
mbclear.style.top = '40px';
mbclear.style.right = '10px';
mbclear.style.zIndex = '10001';
document.body.appendChild(mbclear);

function clearprices(){
    var alltr = table.querySelectorAll('tr');
    var alltd;
    allstates.forEach(function(item,index){
        if(!item){
            alltd = alltr[index+1].querySelectorAll('td');
            for (let i = 2, end = 12; i<end;i++){
                alltd[i].querySelector('input').value = '';
            }
        }
    });
}

function toggletable(){
    overlay.style.display = overlay.style.display == 'none' ? '' : 'none';
    mbtoggletable.value = overlay.style.display == 'none' ? '☨表召喚☨' : '卍表派遣卍';
}

//table wrapper & extras
var overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0px';
overlay.style.right = '0px';
overlay.style.height = '100%';
overlay.style.width = '100%';
overlay.style.zIndex = '9997';
overlay.style.overflow = 'auto';
overlay.style.display = 'none';

var overlaycontents = document.createElement('div');
overlaycontents.style.position = 'absolute';
overlaycontents.style.width = '100%';
overlaycontents.style.margin = 'auto';

var overlaysubcontents = document.createElement('div');
overlaysubcontents.style.textAlign = 'center';
overlaycontents.appendChild(overlaysubcontents);


var optdiv = document.createElement('div');
optdiv.style.align = 'center';
optdiv.style.left = '50%';
optdiv.style.top = '50%';
optdiv.style.display = 'inline-block';

overlaysubcontents.appendChild(optdiv);

var legend = document.createElement('span');
legend.style.backgroundColor = '#333333';
legend.innerHTML = `<font color ='white'>画像左右クリックで色の切替<br>
画像中クリックでプレビュー<br>
名前クリックでｸﾘｯﾌﾟﾎﾞｰﾄﾞ<br></font>
<b><font color="yellow">購入予定</font>
<font color="green">購入済</font>
<font color="red">予定外</font></b>
`;
legend.style.display = 'inline-block';

overlaysubcontents.appendChild(legend);


overlay.appendChild(overlaycontents);
document.body.appendChild(overlay);

var exporter = overlay.cloneNode();
exporter.style.zIndex = '9998';
exporter.style.width = 'auto';
exporter.style.height = 'auto';
exporter.style.top = '50%';
exporter.style.left = '50%';
exporter.style.overflow = '';
exporter.style.transform = 'translate(-50%,-50%)';

var exporterfield = document.createElement('textarea');
exporterfield.cols = 96;
exporterfield.rows = 40;
var mbcloseexport = createbutton('close');
mbcloseexport.addEventListener('click', function(){exporter.style.display = 'none';});
exporter.appendChild(mbcloseexport);
var mbtest = createbutton('copy');
mbtest.addEventListener('click', function(){copyelemtext(exporterfield);});
exporter.appendChild(mbtest);
exporter.insertAdjacentHTML('beforeend','<br>');
exporter.appendChild(exporterfield);
document.body.appendChild(exporter);

//script start
var allitems = Array.from(document.querySelectorAll('.item-list-l')); //all item data
var allstates = []; //icon column colors
var allselections = []; //ship column colors

var allimages = []; //item icons
var allnames = []; //item names
var allgenres = []; //item types
var alldansei = []; //filter setting flags
var allcostume = [];
var allnonfashion = [];
var allbought = [];
var allnoplan = [];

var allcheapest = []; //cheapest column entries
var allitemsoriginal = Array.from(allitems);

for (let index = allitems.length-1; index >= 0; index--){
    var item = allitems[index];
    var genre = item.querySelector('dd.detail > table > tbody > tr:nth-child(1) > td').innerText;
    var description = item.querySelector('dd.description > p').innerText;
    var newarray = [];
    let itemclone;
    if (~genre.indexOf('（セット）') || ~description.indexOf('セットを使用すると')){
        var allsubs = item.querySelectorAll('ul.image > li');
        for (let i = 0, iend = allsubs.length; i < iend; i++){
            var children = allsubs[i].children
            for (let j = 0, jend = children.length; j < jend; j++){
                allsubs[i].removeChild(children[j]);
            }
            itemclone = item.cloneNode(true);
            itemclone.querySelector('dl.item-list-l>dt').innerText = allsubs[i].innerText.split('「').pop().split('」').shift();
            newarray.push(itemclone);
        }
        allitems.splice(index,1);
        for(let i = 0, end = newarray.length; i < end; i++){
            allitems.splice(index+i,0,newarray[i]);
            if(i>0)allitemsoriginal.splice(index+i,0,allitemsoriginal[index]);
        }
    }
}

//parse item data to fill up above arrays
allitems.forEach(function(item,index){
    //image
    var image = item.querySelector('dd.detail').querySelector('img');
    if (image) {image = image.src} else {image = ''}
    allimages.push(image);
    //name
    var name = item.querySelector('dt').innerText;
    allnames.push(name);
    //genre
    var genre = item.querySelector('dd.detail > table > tbody > tr:nth-child(1) > td').innerText;
    var genreabbrev = genre.split('\n')[0];
    allgenres.push(genreabbrev);
    //dansei
    var flavor = item.querySelector('dd.description').innerText;
    var cond1 = genre.indexOf('男性') > -1;
    var cond2 = flavor.indexOf('男性のみ使用可能') > -1;
    var dansei = false;
    if (cond1 || cond2) {dansei = true};
    alldansei.push(dansei);
    //costume
    var cond3 = name.indexOf('[Ou]') > -1;
    var cond4 = (genre.indexOf('コスチューム') > -1) || (genre.indexOf('パーツ') > -1);
    var costume = false;
    if (cond3 || cond4) {costume = true};
    allcostume.push(costume);
    //nonfashion
    var nonfashion = containsany(genre,['マグ','アイテム強化']);
    allnonfashion.push(nonfashion);
});

console.log({allimages},{allnames},{allgenres},{alldansei});

//construct table
var table = document.createElement('table');
table.style.tableLayout = 'auto';
table.className = 'pricetable';
table.style.borderSpacing = '0';
table.style.borderCollapse = 'collapse';
//header
var header = document.createElement('tr');
header.innerHTML = '<th>img</th><td>name</td>'
for (let col = 0, colend=10; col < colend; col++){
    var th = document.createElement('th');
    th.innerText = 'ship'+(col+1);
    th.className = 'ship'+(col+1);
    header.appendChild(th);
}
var cheapheader = document.createElement('td');
cheapheader.innerText = 'cheapest';
cheapheader.addEventListener('click',function(){changed = true;autosuggestcheap();});
header.appendChild(cheapheader);
table.appendChild(header);

//generate rows
for (let row = 0, rowend = allitems.length; row < rowend; row++){
    var tr = document.createElement('tr');
    tr.style.whiteSpace = 'nowrap';
    //add image
    var tdimg = document.createElement('td');
    tdimg.className = 'itemimg';
    var tempimg = document.createElement('img');
    tempimg.width = 50;
    tempimg.height = 50;
    tempimg.src = allimages[row];
    //add events on img click
    tdimg.addEventListener('click',function(){ toggleitemstate(row,); });
    tdimg.addEventListener('contextmenu',function(e){ toggleitemstate(row,-1,true,e); });
    tdimg.addEventListener('mousedown',function(e){if(e.which == 2){e.preventDefault();openpreview(row)};});
    tdimg.appendChild(tempimg);
    tr.appendChild(tdimg);
    //add name
    let tdname = document.createElement('td');
    tdname.className = 'itemname';
    tdname.innerHTML = allnames[row];
    tdname.addEventListener('click',function(){ copytoclip(tdname); });
    tr.appendChild(tdname);
    //add ship columns
    for (let col = 0, colend = 10; col < colend; col++){
        let tdprices = document.createElement('td');
        tdprices.className = 'ship'+(col+1);
        let input = document.createElement('input');
        input.size = 4;
        input.maxLength = 8;
        input.addEventListener('input',function(){changed = true; checkcheapest(row); });
        //add events on price click
        tdprices.addEventListener('click',function(){ togglepricestate(row,tdprices); });
        tdprices.addEventListener('contextmenu',function(e){ togglepricestate(row,tdprices,-1,true,e); });
        tdprices.addEventListener('mousedown',function(e){if(e.which == 2){e.preventDefault();focusinside(tdprices);}});
        tdprices.appendChild(input);
        tr.appendChild(tdprices);

    }
    //add cheapest column
    let cheaptd = document.createElement('td');
    cheaptd.className = 'cheapest';
    cheaptd.addEventListener('click',function(){changed = true; autosuggestcheap(row)});
    tr.appendChild(cheaptd);
    table.appendChild(tr);
}

overlaycontents.appendChild(table);

function hideships(targets){
    //loop through designated ships 1-10 columns to toggle their display
    for (let i in targets){
        var target = targets[i];
        var cells = document.querySelectorAll('.ship'+target);
        cells.forEach(function(item,index){
            var currentdisplay = item.style.display;
            item.style.display = (currentdisplay == 'none') ? '' : 'none';
        });
    }
}

function openpreview(row){
    allitemsoriginal[row].querySelector('a').click();
    if(allgenres[row]=='ボイス'){
        allitemsoriginal[row].querySelector('.voice__list li').click();
    }
}

function togglerows(){
    //loop through designated item rows to display according to settings
    var allrows = table.querySelectorAll('tr');
    var conditions = types;
    for (let row = 1, rowend = allrows.length; row < rowend; row++){
        var hidethisrow = false;
        for (let i in conditions){
            var mask = 1 << (i*1);
            if ( (typeoptions & mask) != 0 && conditions[i][row-1] ){
                hidethisrow = true;
                break
            }
        }
        if (hidethisrow) {allrows[row].style.display = 'none';}
        else {allrows[row].style.display = '';}
    }
}

function toggleitemstate(row,direction,disable,e){
    changed = true;
    //wrapper for toggling color when clicking
    direction = direction || 1;
    if (disable) e.preventDefault();
    var curr = allstates[row];
    if (curr === undefined) {curr = 0;}
    allstates[row] = maptorange(curr+direction,3,0,true);
    colorrowbytoggle([row]);
}

function colorrowbytoggle(rows,all){
    //toggle color
    var colors2use = ['white','yellow','green','red'];
    var allrows = table.querySelectorAll('.itemimg');
    if (all){
        for (let i = 0, end = allrows.length-1; i < end; i++){
            var row = i+1;
            colorthis(allrows[row],row);
        }
    } else {
        for (let i in rows){
            var row = rows[i];
            colorthis(allrows[row],row);

        }
    }
    function colorthis(item,index){
        var state = allstates[index];
        item.style.background = colors2use[state];
        allbought[index] = state==2;
        allnoplan[index] = state==3;
    }
}

function togglepricestate(row,cell,direction,disable,e){
    changed = true;
    direction = direction || 1;
    if (event.target.tagName == 'INPUT') return
    if (disable) e.preventDefault();
    var shipnum = cell.className.split('ship')[1]*1;
    var mask0 = 1<<((shipnum-1)*2);
    var mask1 = mask0*2;
    var wholesel = allselections[row] || 0;
    var currsel = ( (wholesel & mask0)+(wholesel & mask1) ) / mask0;
    var newsel = maptorange(currsel+direction,3,0,true);
    allselections[row] = allselections[row] & ~mask0 & ~mask1; //clear both bits before setting
    allselections[row] |= (newsel * mask0);
    //var updatedwholesel = allselections[row];
    //    console.log({shipnum},{wholesel},{mask0},{mask1},{currsel},{newsel},{updatedwholesel});
    //    var colors2use = ['white','yellow','green','red'];
    //    cell.style.background = colors2use[newsel];
    colorpricebytoggle([row+1],false); //+1 to account for header row
}

function forcechangepricestate(row,shipnum,newvalue,reqvalue){
    var mask0 = 1<<((shipnum-1)*2);
    var mask1 = mask0*2;
    var wholesel = allselections[row] || 0;
    var currsel = ( (wholesel & mask0)+(wholesel & mask1) ) / mask0;
    if ((reqvalue != undefined) && (currsel != reqvalue)) return;
    var newsel = maptorange(newvalue,3,0,true);
    allselections[row] = allselections[row] & ~mask0 & ~mask1; //clear both bits before setting
    allselections[row] |= (newsel * mask0);
    colorpricebytoggle([row+1],false);
}

function colorpricebytoggle(rows,all){
    var allrows = table.querySelectorAll('tr');
    var colors2use = ['white','yellow','green','blue'];
    if (all){
        for (let row = 1, rowend = allrows.length; row < rowend; row++){
            colorthis(row);
        }
    } else {
        for (let i in rows){
            var row = rows[i];
            colorthis(row);
        }
    }
    function colorthis(row){
        var rowsel = allselections[row-1] || 0;
        var currcols = allrows[row].querySelectorAll('td');
        for (let col = 2, colend = 12; col < colend; col++){
            var cell = currcols[col];
            var mask = (2<<(col-1)) + (2<<(col-2)); //col 2 = ship1
            var mask0 = 1<<((col-2)*2); //col 2 = ship1 = 0th&1st bits
            var mask1 = mask0 * 2;
            var cellsel = ((rowsel & mask0) + (rowsel & mask1)) / mask0;
            cell.style.background = colors2use[cellsel];
        }
    }
}

function focusinside(elem){
    elem.querySelector('input').focus();
}

function checkcheapest(row){
    row += 1;
    var allrows = table.querySelectorAll('tr');
    var currrow = allrows[row];
    var cheaptd = currrow.querySelector('.cheapest');
    var rowinputs = currrow.querySelectorAll('input');
    var rowprices = [];
    var shipscounted = 0;
    //get all prices and check if completed
    for (let i = 0, end = 10; i<end; i++){
        var parenttd = rowinputs[i].closest('td');
        if (parenttd.style.display == 'none'){
            shipscounted++;
        } else {
            if (rowinputs[i].value != undefined && rowinputs[i].value != 0) {
                shipscounted++;
                rowprices[i] = rowinputs[i].value;
            }
        }
    }
    if (shipscounted >= 10){
        var buyhere = getminindices(rowprices,1);
        cheaptd.innerText = buyhere;
        allcheapest[row-1] = buyhere;
    } else {
        cheaptd.innerText = '';
        allcheapest[row-1] = undefined;
    }
}

function checkallcheapest(){
    var allrows = table.querySelectorAll('tr');
    for (let i = 1, end = allrows.length; i<end; i++){
        checkcheapest(i-1);
    }
}

function autosuggestcheap(row){
    var allrows = table.querySelectorAll('tr');
    let start = row == undefined ? 1 : row+1;
    let end = row == undefined ? allrows.length : start+1;
    for (let i = start; i < end; i++){
        var cheapest = allcheapest[i-1];
        if (!cheapest || (allstates[i-1] >=2)) continue;
        var allcols = allrows[i].querySelectorAll('td');
        for (let j = 0, end = cheapest.length;j<end;j++){
            forcechangepricestate(i-1,cheapest[j],1,0);
        }
    }
}

function converttotext(){
    var allrows = table.querySelectorAll('tr');
    var text ='';
    var boughtmarker = 'x';
    for (let row = 0, rowend = allrows.length; row<rowend; row++){
        //check if item is neither filtered nor unplanned, or is bought
        if((allrows[row].style.display != 'none' || allstates[row-1] == 2) && allstates[row-1] != 3){

            var rowcols = allrows[row].querySelectorAll('td,th');
            if (row == 0){
                text += '        \t\t';
            } else {
                if (text) text += '\n';
                text += rowcols[1].innerText;
                //align names with tab
                for (let i = 0, end = (21 - rowcols[1].innerText.length) / 7 -1; i < end; i++){
                    text += '\t';
                }
            }
            //add x if bought
            if(allstates[row-1]==2) text += boughtmarker;
            for (let col = 2, colend = 12; col < colend; col++){
                if (rowcols[col].style.display != 'none'){
                    if (row ==0){
                        text += '\tship'+(col-1);
                        if(col==11) text += '\n';
                        continue
                    }
                    text += '\t' +rowcols[col].querySelector('input').value;
                    switch (getselectionofcell(row-1,col-1)){
                        case 3:
                            text +=boughtmarker;
                        case 2:
                            text +=boughtmarker;
                    }
                }
            }
        }
    }
    exporterfield.value = text;
    exporter.style.display = exporter.style.display == 'none'? '' : 'none';
}

function getselectionofcell(item,ship){
    var rowsel = allselections[item];
    var mask0 = 1<<((ship-1)*2); //col 2 = ship1 = 0th&1st bits
    var mask1 = mask0 * 2;
    var output = ((rowsel & mask0) + (rowsel & mask1)) / mask0;
    return output;
}

//general functions
function containsany(str, items){
    for(var i in items){
        var item = items[i];
        if (str.indexOf(item) > -1){
            return true;
        }

    }
    return false;
}

function copytoclip(item){
    document.oncopy = function(event) {
        event.clipboardData.setData("Text", item.innerText || item.value);
        event.preventDefault();
    };
    document.execCommand("Copy");
    document.oncopy = undefined;
    selectText(item);
}

function copyelemtext(elem){
    elem.select();
    //    selectText(elem);
    document.execCommand('copy')
}

function selectText(el){
    var sel, range;
    if (window.getSelection && document.createRange) {
        sel = window.getSelection();
        if(sel.toString() == ''){
            window.setTimeout(function(){
                range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
            },1);
        }
    }else if (document.selection) {
        sel = document.selection.createRange();
        if(sel.text == ''){
            range = document.body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
    }
}

function maptorange(value,max,min,wrap){
    value = value || 0;
    max = max || 0;
    min = min || 0;
    wrap = wrap || true;
    console.log("maptorange: ",{wrap},{value},{max},{min});
    if (!wrap) return Math.min(Math.max(value, min), max);
    value = value % (max+1);
    if (value < min) value += max - min + 1;
    console.log({value});
    return value;
}

function createbutton(value,f){
    var tempbutton = document.createElement('input');
    tempbutton.type = 'button';
    tempbutton.value = value;
    tempbutton.style.width = '50px';
    return tempbutton
}

function getminindices(array,offset){
    if (array.length <= 0) return
    offset = offset || 0;
    var indices = [];
    var check = array[0];
    for (let i in array){
        if ((array[i]*1) == check){
            indices.push(i*1+offset);
        }
        if ((array[i]*1) < check){
            check = array[i];
            indices = [i*1+offset]
        }
    }
    return indices
}

//options
//ship display
var shipsbinary = 0;
var shipbuttons = [];
for (let i = 1, end = 10; i<=end; i++){
    if (i == 6){
        optdiv.insertAdjacentHTML('beforeend', '<br>')
    }
    let temp = createbutton('ship'+i);
    temp.addEventListener('click',function(){mbhideship(i,temp);});
    optdiv.appendChild(temp);
    shipbuttons.push(temp);
}

function mbhideship(shipnum,button){
    shipsbinary ^= (1 << shipnum);
    var tempcollection = document.querySelectorAll('.ship'+shipnum);
    tempcollection.forEach(function(item,index){
        item.style.display = item.style.display == 'none'? '' : 'none';
    });
    button.style.color = button.style.color == 'red'? '' : 'red';

}

//type display
var typeoptions = 0;
var types = [alldansei, allcostume, allnonfashion,allbought,allnoplan];
var typenames = ['男性','ｺｽﾁｭﾑ','非ﾌｧｯｼｮﾝ','購入済','予定外'];
var typebuttons = [];
optdiv.insertAdjacentHTML('beforeend', '<br>')
for (let i = 0, end = types.length; i < end; i++){
    let temp = createbutton(typenames[i]);
    temp.addEventListener('click',function(){mbtoggletype(i,temp);});
    optdiv.appendChild(temp);
    typebuttons.push(temp);
}

function mbtoggletype(type,button){
    typeoptions ^= (1 << type);
    togglerows();
    button.style.color = button.style.color == 'red'? '' : 'red';
}


//save function
//load from storage to rebuild table prices and display states
save2table();
save2option();

//save to storage on exit
window.onbeforeunload = function() {
    table2save();
    option2save();
}

//autosave every 5 minutes if change has been made to table
var changed = false;
var autosave = setInterval(autosavewrapper,1000*60*5);

function autosavewrapper(){
    if (changed) {
        all2save()
        changed = false;
        console.log('autosaved');
    };
}

function all2save(){
    table2save();
    option2save();
}

function table2save(){
    var prices = [];
    var tablerows = table.querySelectorAll('tr');
    //loop through rows, skipping header
    for (let row = 1, rowend = tablerows.length; row < rowend; row++){
        var tablecols = tablerows[row].querySelectorAll('td');
        var temparray = [];
        var itemname = tablecols[1].innerText;
        temparray.push(itemname);
        //loop through cols, skipping img and name
        for (let col = 2, colend = 12; col < colend; col++){
            var currprice = tablecols[col].querySelector('input').value;
            temparray.push(currprice);
        }
        prices.push(temparray);
    }
    console.log({prices});
    //var catalogid = document.URL.split('ac/')[1].split('/')[0];

    localStorage.setItem(catalogid, JSON.stringify(prices) );
    //save states
    localStorage.setItem(catalogid+'states', JSON.stringify(allstates));
    //save selections
    localStorage.setItem(catalogid+'selections', JSON.stringify(allselections));
}

function option2save(){
    localStorage.setItem('shipoptions',shipsbinary);
    localStorage.setItem('typeoptions',typeoptions);
}

function save2table(){
    var temp = localStorage.getItem(catalogid);
    if (!temp) return
    var prices = JSON.parse( localStorage.getItem(catalogid) );
    var tablerows = table.querySelectorAll('tr');
    //loop through rows, skipping header
    for (let row = 1, rowend = tablerows.length; row < rowend; row++){
        var tablecols = tablerows[row].querySelectorAll('td');
        var itemname = tablecols[1].innerText;
        if (itemname != prices[row-1][0]) continue
        //loop through cols, skipping img and name
        for (let col = 2, colend = 12; col < colend; col++){
            var currprice = prices[row-1][col-1];
            var currinput = tablecols[col].querySelector('input');
            currinput.value = currprice;
        }
    }
    console.log({prices});
    setTimeout(function(){checkallcheapest();},1000);
    //load states
    temp = localStorage.getItem(catalogid+'states');
    if (temp) allstates = JSON.parse(temp);
    console.log({allstates});
    colorrowbytoggle('',true);
    //load selections
    temp = localStorage.getItem(catalogid+'selections');
    console.log('load selections: ',{temp});
    if (temp) allselections = JSON.parse(temp);
    console.log({allselections});
    colorpricebytoggle('',true);
}

function save2option(){
    //ship display
    var temp = localStorage.getItem('shipoptions');
    if (!temp) return
    shipsbinary = temp * 1;
    console.log({shipsbinary});
    var hidetargets = [];
    for (let i = 1, end = 10; i <= end; i++){
        var mask = 1 << i;
        if ((shipsbinary & mask) != 0){
            hidetargets.push(i);
            shipbuttons[i-1].style.color = shipbuttons[i-1].style.color == 'red' ? '' : 'red';
        }
    }
    hideships(hidetargets);
    console.log({hidetargets});

    //type diplay
    temp = localStorage.getItem('typeoptions');
    //    if(!temp) return
    typeoptions = temp * 1;
    console.log({typeoptions});
    togglerows();
    for (let i = 0, end = types.length; i < end; i++){
        var typemask = 1 << i;
        if ( (typeoptions & typemask) != 0){
            typebuttons[i].style.color = 'red';
        }

    }

}