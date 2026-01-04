Tabs.kocchat = {
        tabOrder : 8001,
        tabLabel : 'Koc Chat',
        tabColor : 'blue',
        myDiv : null,
        Options : {
            Counter : 0,
        },
     
        init : function (div){
            var t = Tabs.kocchat;
            t.myDiv = div;
     
            if (!Options.kocchat) {
                Options.kocchat = t.Options;
            }
            else {
                for (var y in t.Options) {
                    if (!Options.kocchat.hasOwnProperty(y)) {
                        Options.kocchat[y] = t.Options[y];
                    }
                }
            }
        },
     
        hide : function (){
            var t = Tabs.kocchat;
        },
     
        show : function (){
            var t = Tabs.kocchat;
     
            var m = 'http://koc-chat.chatango.com/';
            t.myDiv.innerHTML = '<iframe src="' + m + '" style="width:100%; height:500px; border:none;"></iframe>';
     
        },
    }

