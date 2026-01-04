// ==UserScript==
// @name         pickersope
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://seller.shopee.co.id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421775/pickersope.user.js
// @updateURL https://update.greasyfork.org/scripts/421775/pickersope.meta.js
// ==/UserScript==

(function() {
    'use strict';
var diva = document.createElement('div')
diva.style.position = 'fixed'
diva.style.top = '0px'
diva.style.zIndex = "7000"
diva.style.right = '0px'
document.getElementsByTagName("html")[0].appendChild(diva)

var imput = document.createElement('input')
imput.setAttribute("id", "imput")

var nota = document.createElement('button')
nota.innerHTML = 'NOTA'
nota.setAttribute("id", "tbl")

var tblprint = document.createElement('button')
tblprint.innerHTML = 'PRINT'
tblprint.setAttribute("id", "tbl")

diva.appendChild(imput)
diva.appendChild(nota)
diva.appendChild(tblprint)

var cs = document.createElement('style');
cs.innerHTML=`
#tbl {
  background-color: #e7e7e7;
  border: 2px solid #f44336;
  color: black;
  padding: 14px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius:5px;
}
#tbl:hover {
  background-color: #f44336;
  color: white;
}
#imput{
  background-color: #e7e7e7;
  border: 2px solid #f44336;
  color: black;
  padding: 14px 32px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  border-radius:5px;
}
#cont{
  border-style: none;
  position: relative;
  border-width:1px;
  width:500px;
  height:500px;
}
#divqrno{
  position: inherit;
  width:100%;
  height:89px
}

#imgnotrans{
  float:left;
}
p{
  text-transform: uppercase;
  font-family:monospace;
}
#pnotrans{
  font-family: -webkit-pictograph;    
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 1px 1px;
}
#divitem{
  border-top-style:dashed;
  border-bottom-style:dashed;
  position: inherit;
  border-width:1px;

}
#divbcitem{
  width:195px;
  float:left;
}
#divqty{
  float:left;
}
#divnobc{
  width:100%;
}
#divdetail{
  border-width:1px;
}
#pdetail{
  margin-bottom:auto;
  margin-top:14px;
}

`
document.getElementsByTagName('head')[0].appendChild(cs)
//cari transaksi berdasarkan id transaksi
imput.addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        var idtrans = imput.value
        window.location.href = 'https://seller.shopee.co.id/portal/sale/'+idtrans;
    }})
//buat nota
nota.addEventListener("click", function(){
    document.getElementsByTagName('head')[0].remove()
    document.getElementsByTagName('body')[0].remove()
    document.getElementsByTagName('html')[0].appendChild(document.createElement('head'))
    document.getElementsByTagName('html')[0].appendChild(document.createElement('body'))

    document.getElementsByTagName('head')[0].appendChild(cs)
    var container = document.createElement('div')
    container.setAttribute("id", "cont")

    document.getElementsByTagName('body')[0].appendChild(container)
    var divqrnotrans = document.createElement('div')
    divqrnotrans.setAttribute("id", "divqrno")
    container.appendChild(divqrnotrans)

        var imgnotrans = document.createElement('img')
        imgnotrans.setAttribute("id","imgnotrans")        
        divqrnotrans.appendChild(imgnotrans)


        var pnotrans = document.createElement('p')        
        pnotrans.setAttribute("id","pnotrans")
        divqrnotrans.appendChild(pnotrans)

        var pkurir = document.createElement('p')        
        pkurir.setAttribute("id","pnotrans")
        divqrnotrans.appendChild(pkurir)
        pkurir.style.fontSize="36px"


//------------------------------------------ working on data

fetch('https://seller.shopee.co.id/api/v3/order/get_one_order?SPC_CDS=c9ab67a1-b270-4c21-b1cc-84b65ebaba4b&SPC_CDS_VER=2&order_id='+window.location.href.slice(-14))
    .then(response => response.json())
    .then(data =>{
        imgnotrans.src="https://www.bcgen.com/demo/linear-dbgs.aspx?S=13&D="+ data.data.order_sn+"&CC=T&CT=T&ST=F&X=0.07&O=0&BBV=0&BBH=0&CG=0&BH=1.5&LM=0.2&EM=0&CS=0&PT=T&TA=T&CA=&CB="
        pnotrans.innerHTML= data.data.order_sn
        pkurir.innerHTML='SP-'+data.data.actual_carrier.slice(0, 3)

        for(let i = 0; i < data.data.order_items.length; i++){

            var divitem = document.createElement('div')
            divitem.setAttribute("id", "divitem")
            container.appendChild(divitem)

                var divbcitem = document.createElement('div')
                divbcitem.setAttribute("id", "divbcitem")
                divitem.appendChild(divbcitem)

                let imgbcitem = document.createElement('img')
                divbcitem.appendChild(imgbcitem)

                var divqty = document.createElement('div')
                divqty.setAttribute("id", "divqty")
                divitem.appendChild(divqty)

                var pqty = document.createElement('p')
                pqty.setAttribute("id","pnotrans")
                divqty.appendChild(pqty)
                pqty.style.fontSize='40px'
                pqty.innerHTML=data.data.order_items[i].amount

                var divpcs = document.createElement('div')
                divpcs.setAttribute("id", "divqty")
                divpcs.style.fontSize = '35px'
                divpcs.style.marginLeft = '5px'
                divpcs.innerHTML="pcs"
                divitem.appendChild(divpcs)


                var divnobc = document.createElement('div')
                divnobc.setAttribute("id", "divnobc")
                divitem.appendChild(divnobc)


                let pnobc = document.createElement('p')
                pnobc.setAttribute("id","pnotrans")
                pnobc.setAttribute("class","pnobc")
                divnobc.appendChild(pnobc)
                pnobc.style.fontSize='40px'
                pnobc.style.textAlign='end'


                var divdetail = document.createElement('div')
                divdetail.setAttribute("id", "divdetail")
                divitem.appendChild(divdetail)

                    let pdetail = document.createElement('p')
                    pdetail.setAttribute("id","pdetail")
                    divdetail.appendChild(pdetail)
                    pdetail.style.fontSize='21px'                    

                fetch('https://api.npoint.io/8c80228588ba9f00fdeb/'+data.data.order_items[i].product.sku)
                    .then(response => response.json())
                    .then(bin =>{
                        imgbcitem.src="https://www.bcgen.com/demo/linear-dbgs.aspx?S=13&D="+bin[0]+"&CC=T&CT=T&ST=F&X=0.07&O=0&BBV=0&BBH=0&CG=0&BH=1&LM=0.2&EM=0&CS=0&PT=T&TA=F&CA=&CB="
                        pnobc.innerHTML=bin[0]
                        pdetail.innerHTML=bin[1]+" - "+bin[2]+" - "+bin[3]
                })

        }

    });







})

tblprint.addEventListener('click', function(){
    imput.value = 'Sudah Dicetak'
    diva.style.visibility = 'hidden'
    print()
    diva.style.visibility = 'visible'
})

})();