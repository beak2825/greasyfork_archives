(function () {
    WebSocket=class extends WebSocket{
        constructor(){
            arguments[0].includes("services")||(arguments[0]="wss://looneymoons.xyz")
            super(...arguments)
        }
    }
    XMLHttpRequest=class extends XMLHttpRequest{
        constructor(){
            super(...arguments)
        }
        open(){
            arguments[1]&&arguments[1].includes("src/shellshock.js")&&(this.fromLoadJS=!1)
            super.open(...arguments)
        }
        get response(){
            if(this.fromLoadJS)
                return "";
            let res=super.response;
            if("string"==typeof res&&res.length>2e4){
                res = res.replace(/\.012,/g,".0009,");
                res = res.replace(/this\.ammo\.rounds--,/g,"");
                res = res.replace(/this\.dy=\.13/g,"this.dy=.17");
                let r = res.match(/([A-z]{1,2})\.resetCountdowns\(\),([A-z]{1,2})\(5\)/);
                res = res.replace(r[0],`${r[1]}.resetCountdowns(),${r[2]}(1)`);
            }
            return res;
        }
    };
  })(); 