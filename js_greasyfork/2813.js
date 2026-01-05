// ==UserScript==
// @name        Aliexpress order history
// @namespace   mindfuck
// @include     http://trade.aliexpress.com/order_list.htm
// @include     http://trade.aliexpress.com/orderList.htm
// @description Scrapes AliExpress order history into a CSV file suitable for spreadsheet use.
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2813/Aliexpress%20order%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/2813/Aliexpress%20order%20history.meta.js
// ==/UserScript==

if (window.top != window.self)  //-- Don't run on frames or iframes
    return;

var orders = [
];

var cstoken='';

function grabOrders(doc)
{
    //console.log("grabOrders called");
    var tags = doc.getElementsByTagName('a');
    for (var i = 0; i < tags.length; i++)
    {
        if (tags[i].href.startsWith('http://trade.aliexpress.com/order_detail.htm?orderId='))
        {
           // console.log("grabOrders pushed: "+tags[i].href);
            orders.push(tags[i].href);
        }
    }
    
    tags=doc.getElementsByTagName('input');
    for (var i = 0; i < tags.length; i++)
    {
        if (tags[i].name.startsWith('_csrf_token'))
        {
            cstoken=tags[i].value;
            break;
        }
    }
        
}

grabOrders(document);


var doneLoading=0;
var currentPage=1;

var page_request = new XMLHttpRequest();

function loadAPage()
{
var parameters = "_csrf_token="+cstoken+"&_fm.o._0.s=&action=OrderListAction&_fm.o._0.e=&_fm.o._0.c=&_fm.o._0.l=&_fm.o._0.or=&_fm.o._0.p=&_fm.o._0.o=&pageNum="+currentPage+"&_fm.o._0.cu=1&sortKey=&eventSubmitDoPage=doPage";
page_request.open('POST', 'orderList.htm?rand='+Math.random(), true);
page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

page_request.send(parameters);
}


page_request.onreadystatechange = function ()
{
    
    if (page_request.readyState == 4 && page_request.status == 200)
        {
       //document.body.innerHTML=page_request.responseText;
       if(page_request.responseText.indexOf('Your search did not match any listings')!=-1)
           {
               doneLoading=1;
               finalProcessing();
               return;
           }
       var div = window.content.document.createElement('div');
       div.innerHTML = page_request.responseText;
       grabOrders(div);          
       div=null;
       currentPage++;
       loadAPage();
        }
};


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function finalProcessing()
{
    var ulist=[];
    ulist=orders.filter( onlyUnique );
    
    var detail=resolveDetail(ulist);
    
    var htm=formatHtml(detail);
    
    document.body.innerHTML=htm;    
}


function grabDetails(doc)
{
    var r=[];
    
    var dfound=0;
    //<li><label>Order Date</label>: <span>2014-06-23 00:35:02 </span></li>
    //console.log("grabDetails called");
    var tags = doc.getElementsByTagName('span');
    for (var i = 0; i < tags.length; i++)
    {
        if (tags[i].className.startsWith('final-price'))
        {
            var d=tags[i].innerHTML;
            //console.log("grabDetails found price: "+d);
            r[0]=d;            
        }
    }
    
    tags = doc.getElementsByTagName('label');
    for (var i = 0; i < tags.length; i++)
    {
        if (tags[i].innerHTML.startsWith('Payment Date'))
        {
            var d=tags[i].nextSibling.nextSibling.innerHTML;
          //  console.log("grabDetails found date: "+d);
            r[1]=d;
            dfound=1;
        }
    }
    
    
    if(dfound==0)
    {
     tags = doc.getElementsByTagName('label');
        for (var i = 0; i < tags.length; i++)
        {
            if (tags[i].innerHTML.startsWith('Order Date'))
            {
                var d=tags[i].nextSibling.nextSibling.innerHTML;
                //console.log("grabDetails found price: "+d);
                r[1]=d;
                dfound=1;
            }
        }       
    }
    
    
    
    tags = doc.getElementsByTagName('a');
    for (var i = 0; i < tags.length; i++)
    {
        if (tags[i].className.startsWith('baobei'))
        {
            var d=tags[i].innerHTML;
            //console.log("grabDetails found name: "+d);
            r[2]=d;
        }
    }
    
    
   return r;
}

function resolveDetail(ulist)
{
    var datelist=[];
    var pricelist=[];
    var namelist=[];
    
    for(var i=0;i<ulist.length;i++)
        {
            console.log("fetching :"+ ulist[i]);   
            var page_request = new XMLHttpRequest();
            page_request.open('GET', ulist[i], false);
            page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            page_request.send(null);
             if (page_request.readyState == 4 && page_request.status == 200)
                    {             
                   var div = window.content.document.createElement('div');
                   div.innerHTML = page_request.responseText;
                   var det=grabDetails(div);          
                   div=null;                   
                    pricelist[i]=det[0];
                    datelist[i]=det[1];                    
                    namelist[i]=det[2];
                    }
            
        }
    

    
    var r=[ulist,datelist,pricelist,namelist];
    return r;   
}


function trim1 (str) {
    if(str==null)
        return '';
        
        
    var r= str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    r=r.replace(/,/g,'');
    return r;
}


function formatHtml(x)
{
    var r="url,date,price,description<br>";
    var ulist=x[0];
    var dlist=x[1];
    var plist=x[2];
    var nlist=x[3];
    
    for(var i=0;i<ulist.length;i++)
        {
         r+= trim1(ulist[i])+","+trim1(dlist[i])+","+trim1(plist[i])+","+trim1(nlist[i])+"<br>";  
        }
    
 return r;
}

loadAPage();