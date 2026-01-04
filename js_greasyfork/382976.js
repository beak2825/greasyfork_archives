function getBTCJSON(){
    var price = getURL("https://api.coindesk.com/v1/bpi/currentprice.json");
    return price;
}

function getURL(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;


}
lol