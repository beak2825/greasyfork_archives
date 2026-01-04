// ==UserScript==
// @name         Torn CT Map Draw Class
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to draw all the world!
// @author       Jox [1714547]
// @grant        none
// @match        *
// @downloadURL https://update.greasyfork.org/scripts/392756/Torn%20CT%20Map%20Draw%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/392756/Torn%20CT%20Map%20Draw%20Class.meta.js
// ==/UserScript==

class ctMapDraw{

    constructor(element){
        this.element = element;

        this.ctx = null;
        this.ctxTemp = null;
        this.ctxBG = null;
        this.ctxGrid = null;

        this.drawSize = 10000;
        this.drawOffset = {x: 0, y:0};

        this.drawMap = false;

        this.addGlobalStyle('.ctMapDrawer {height: 600px; background-color: white; overflow: auto; padding: 5px;}');
        this.addGlobalStyle('.ctMapDrawerCanvasContainer {position: relative;}');
        this.addGlobalStyle('.ctMapDrawerCanvas {position: absolute; top: 0; left: 0;}');
        this.addGlobalStyle('.ctMapDrawerControls {position: sticky; top: 0; left: 0; background-color: rgb(255,255,255,0.8); padding: 5px; border-radius: 5px;}');
        this.addGlobalStyle('.ctMapDrawerControls > * {margin-left: 5px; vertical-align: middle;}');
        this.addGlobalStyle('.ctMapVisible{display: none;}');
        this.addGlobalStyle('.ctMapRing {animation: ring 4s .7s ease-in-out infinite; } @keyframes ring {0% { transform: rotate(0); } 1% { transform: rotate(15deg); } 3% { transform: rotate(-14deg); } 5% { transform: rotate(17deg); } 7% { transform: rotate(-16deg); } 9% { transform: rotate(15deg); } 11% { transform: rotate(-14deg); } 13% { transform: rotate(13deg); } 15% { transform: rotate(-12deg);} 17% { transform: rotate(11deg); } 19% { transform: rotate(-10deg); } 21% { transform: rotate(9deg); } 23% { transform: rotate(-8deg); } 25% { transform: rotate(7deg); } 27% { transform: rotate(-6deg); } 29% { transform: rotate(5deg); } 31% { transform: rotate(-4deg); } 33% { transform: rotate(3deg); } 35% { transform: rotate(-2deg); } 37% { transform: rotate(1de  39% { transform: rotate(0); } 100% { transform: rotate(0); }}');
        this.addGlobalStyle('#ctUser1714547 svg {fill: yellow;}');

        var div = document.createElement('div');
        div.style.marginBottom = '10px';

        //Create header
        let header = document.createElement('div');
        header.classList.add('title-black', 'm-top10', 'title-toggle', 'active', 'top-round');
        header.innerHTML = 'CT Map Drawing by Jox'
        header.onclick = function(e){
            document.getElementById('ctMapDrawer').classList.toggle('ctMapVisible');
            if(document.getElementById('ctMapDrawer').classList.contains('ctMapVisible')){
                e.srcElement.innerHTML = 'CT Map Drawing by Jox (expand)';
            }
            else{
                e.srcElement.innerHTML = 'CT Map Drawing by Jox (collapse)';
            }
        }

        //Create body
        let body = document.createElement('div');
        body.classList.add('cont-gray10', 'bottom-round', 'cont-toggle', 'unreset');

        body.id = 'ctMapDrawer';
        body.classList.add('ctMapDrawer', 'ctMapVisible');
        if(body.classList.contains('ctMapVisible')){
            header.innerHTML = 'CT Map Drawing by Jox (expand)';
        }
        else{
            header.innerHTML = 'CT Map Drawing by Jox (collapse)';
        }

        //Add header and body elements
        div.appendChild(header);
        div.appendChild(body);

        this.container = body;

        this.element.appendChild(div);

        this.addMapDrawer();
    }

    addMapDrawer(){
        var that = this;

        //reseting variable
        this.drawMap = false;

        //clearing container
        this.container.innerHTML = '';

        let a = document.createElement('a');
        a.href = '#';
        a.innerHTML = 'Start Drawing';
        this.container.appendChild(a);

        a.addEventListener("click", function(e) {
            e.preventDefault();
            that.startDrawing();
        }, false);


        let p = document.createElement('p');
        p.innerHTML = ' or select saved image to continue...';
        p.style.margin = '5px 0';
        this.container.appendChild(p);

        let input = document.createElement('input');
        input.type = 'file';
        input.id = 'savedMapImage';
        this.container.appendChild(input);

        input.addEventListener("change", function(event) {
            var files = input.files;
            if (files.length) {
                if(files[0].type == 'image/png'){
                    that.startDrawing(files[0]);
                }
            }

        }, false);
    }

    startDrawing(file){
        var that = this;

        let world = document.getElementById('world');
        let worldTransform = world.style.transform.replace('translate(','').replace(')','').replace(/px/g,'').split(',').map(x => {return Number(x) * -1});

        //Making drawOffset
        this.drawOffset.x = worldTransform[0] - (this.drawSize / 2);
        this.drawOffset.y = worldTransform[1] - (this.drawSize / 2);

        if(this.drawOffset.x < 0){
            this.drawOffset.x = 0;
        }

        if(this.drawOffset.y < 0){
            this.drawOffset.y = 0;
        }

        let canvasContainer = document.createElement('div');
        canvasContainer.classList.add('ctMapDrawerCanvasContainer');
        canvasContainer.id = 'ctMapDrawerCanvasContainer';
        canvasContainer.style.zoom = '50%';

        //Main canvas for image
        let canvas = document.createElement('canvas');
        canvas.id = 'ctMapDrawerCanvas'
        canvas.width = this.drawSize; //Number(world.style.width.replace('px',''));
        canvas.height = this.drawSize; //Number(world.style.height.replace('px',''));
        canvas.classList.add('ctMapDrawerCanvas');
        canvas.style.zIndex = 1

        //temp canvas for drawing
        let canvasTemp = document.createElement('canvas');
        canvasTemp.id = 'ctMapDrawerCanvasTemp'
        canvasTemp.width = this.drawSize; //Number(world.style.width.replace('px',''));
        canvasTemp.height = this.drawSize; //Number(world.style.height.replace('px',''));
        canvasTemp.style.display = 'none';

        //background canvas for drawing background
        let canvasBG = document.createElement('canvas');
        canvasBG.id = 'ctMapDrawerCanvasBG'
        canvasBG.width = this.drawSize; //Number(world.style.width.replace('px',''));
        canvasBG.height = this.drawSize; //Number(world.style.height.replace('px',''));
        canvasBG.classList.add('ctMapDrawerCanvas');
        canvasBG.style.zIndex = 0

        //grid canvas for drawing grid lines
        let canvasGrid = document.createElement('canvas');
        canvasGrid.id = 'ctMapDrawerCanvasGrid'
        canvasGrid.width = this.drawSize; //Number(world.style.width.replace('px','')) ;
        canvasGrid.height = this.drawSize; //Number(world.style.height.replace('px',''));
        canvasGrid.classList.add('ctMapDrawerCanvas');
        canvasGrid.style.zIndex = 2

        //Contols to show hide backgorund and grid
        let div = document.createElement('div');
        div.classList.add('ctMapDrawerControls');
        div.style.zIndex = 10;

        let cbBG = document.createElement('input');
        cbBG.id = 'ctMapDrawerControlCbBG';
        cbBG.type = 'checkbox';
        cbBG.checked = true;
        cbBG.addEventListener('click', function(e){
            if(this.checked){
                document.getElementById('ctMapDrawerCanvasBG').style.display = null;
            }
            else{
                document.getElementById('ctMapDrawerCanvasBG').style.display = 'none';
            }
        })
        let lblBG = document.createElement('label');
        lblBG.htmlFor = 'ctMapDrawerControlCbBG';
        lblBG.innerHTML = 'Background';

        let cbGrid = document.createElement('input');
        cbGrid.id = 'ctMapDrawerControlCbGrid';
        cbGrid.type = 'checkbox';
        cbGrid.checked = true;
        cbGrid.addEventListener('click', function(e){
            if(this.checked){
                document.getElementById('ctMapDrawerCanvasGrid').style.display = null;
            }
            else{
                document.getElementById('ctMapDrawerCanvasGrid').style.display = 'none';
            }
        })
        let lblGrid = document.createElement('label');
        lblGrid.htmlFor = 'ctMapDrawerControlCbGrid';
        lblGrid.innerHTML = 'Grid';

        let cbPlayer = document.createElement('input');
        cbPlayer.id = 'ctMapDrawerControlCbPlayer';
        cbPlayer.type = 'checkbox';
        cbPlayer.checked = true;
        cbPlayer.addEventListener('click', function(e){
            if(this.checked){
                document.getElementById('ctMapDivPlayer').style.display = null;
            }
            else{
                document.getElementById('ctMapDivPlayer').style.display = 'none';
            }
        })
        let lblPlayer = document.createElement('label');
        lblPlayer.htmlFor = 'ctMapDrawerControlCbPlayer';
        lblPlayer.innerHTML = 'Player';

        let linkSave = document.createElement('a');
        linkSave.href = '#';
        linkSave.innerHTML = 'Save image';
        linkSave.style.float = 'right';
        linkSave.addEventListener('click', e => {that.saveImage(e, 'save')});

        let linkExport = document.createElement('a');
        linkExport.href = '#';
        linkExport.innerHTML = 'Export image';
        linkExport.style.float = 'right';
        linkExport.addEventListener('click', e => {that.saveImage(e, 'export')});

        //Contols to show zoom map
        let aZoom25 = document.createElement('a');
        aZoom25.href = '#';
        aZoom25.innerHTML = '25%';
        aZoom25.addEventListener('click', function(e){
            e.preventDefault();
            document.getElementById('ctMapDrawerCanvasContainer').style.zoom = '25%';
            that.autoScrollMap();
        });

        let aZoom50 = document.createElement('a');
        aZoom50.href = '#';
        aZoom50.innerHTML = '50%';
        aZoom50.addEventListener('click', function(e){
            e.preventDefault();
            document.getElementById('ctMapDrawerCanvasContainer').style.zoom = '50%';
            that.autoScrollMap();
        });

        let aZoom75 = document.createElement('a');
        aZoom75.href = '#';
        aZoom75.innerHTML = '75%';
        aZoom75.addEventListener('click', function(e){
            e.preventDefault();
            document.getElementById('ctMapDrawerCanvasContainer').style.zoom = '75%';
            that.autoScrollMap();
        });

        let aZoom100 = document.createElement('a');
        aZoom100.href = '#';
        aZoom100.innerHTML = '100%';
        aZoom100.addEventListener('click', function(e){
            e.preventDefault();
            document.getElementById('ctMapDrawerCanvasContainer').style.zoom = '100%';
            that.autoScrollMap();
        });

        let aZoom125 = document.createElement('a');
        aZoom125.href = '#';
        aZoom125.innerHTML = '125%';
        aZoom125.addEventListener('click', function(e){
            e.preventDefault();
            document.getElementById('ctMapDrawerCanvasContainer').style.zoom = '125%';
            that.autoScrollMap();
        });

        let aZoom150 = document.createElement('a');
        aZoom150.href = '#';
        aZoom150.innerHTML = '150%';
        aZoom150.addEventListener('click', function(e){
            e.preventDefault();
            document.getElementById('ctMapDrawerCanvasContainer').style.zoom = '150%';
            that.autoScrollMap();
        });

        //Action to restart map drawing
        let aRestart = document.createElement('a');
        aRestart.href = '#';
        aRestart.innerHTML = 'Restart';
        aRestart.addEventListener('click', function(e){
            e.preventDefault();
            if (confirm("Restart drawing? All unsaved changes will be lost!")) {
                that.addMapDrawer();
            }
        });

        //Add filters to image
        let aFilters = document.createElement('a');
        aFilters.href = '#';
        aFilters.innerHTML = 'Blueprint';
        aFilters.addEventListener('click', function(e){
            e.preventDefault();
            if(that.ctx.canvas.style.filter == '' || that.ctx.canvas.style.filter == 'none'){
                that.ctx.canvas.style.filter = 'brightness(150%) contrast(10%)';
            }
            else{
                that.ctx.canvas.style.filter = null;
            }
        });

        //div to show playr position
        let divPlayer = document.createElement('div');
        divPlayer.id = 'ctMapDivPlayer';
        divPlayer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" filter="" fill="lime" stroke="black" stroke-width="0.3" viewBox="0 0 16 16"><g><path class="iconPath" d="M 8 4.2773 C 8.9482 4.2773 9.7173 3.5437 9.7173 2.6389 C 9.7173 1.7336 8.9482 1 8 1 C 7.0515 1 6.2825 1.7336 6.2825 2.6389 C 6.2825 3.5437 7.0515 4.2773 8 4.2773 ZM 10.9873 8.1191 L 10.6292 5.6429 C 10.5574 5.1545 10.0758 4.7334 9.5591 4.7334 L 6.4407 4.7334 C 5.9236 4.7334 5.4418 5.1545 5.3706 5.6429 L 5.0128 8.1084 C 4.9413 8.5972 5.177 9.0024 5.5363 9.0024 C 5.8955 9.0024 6.2214 9.4077 6.2595 9.8997 L 6.5886 14.104 C 6.6267 14.5962 7.0815 15 7.5988 15 L 8.4008 15 C 8.9182 15 9.3727 14.5973 9.4109 14.1055 L 9.7396 9.9025 C 9.7782 9.4103 10.1041 9.0076 10.4633 9.0076 C 10.8225 9.0076 11.0585 8.6079 10.9873 8.1191 Z"></path></g></svg>'
        divPlayer.style.position = 'absolute';
        divPlayer.style.zIndex = 5;
        divPlayer.classList.add('ctMapRing');
        //divPlayer.querySelector('svg').style.fill = 'lime';


        div.appendChild(aRestart);

        div.appendChild(cbBG);
        div.appendChild(lblBG);
        div.appendChild(cbGrid);
        div.appendChild(lblGrid);
        div.appendChild(cbPlayer);
        div.appendChild(lblPlayer);

        div.appendChild(aZoom25);
        div.appendChild(aZoom50);
        div.appendChild(aZoom75);
        div.appendChild(aZoom100);
        div.appendChild(aZoom125);
        div.appendChild(aZoom150);

        div.appendChild(aFilters);

        div.appendChild(linkExport);
        div.appendChild(linkSave);

        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(canvasTemp);
        canvasContainer.appendChild(canvasBG);
        canvasContainer.appendChild(canvasGrid);
        canvasContainer.appendChild(divPlayer);

        this.container.innerHTML = '';
        this.container.appendChild(canvasContainer);
        this.container.appendChild(div);

        this.ctx = canvas.getContext("2d");
        this.ctxTemp = canvasTemp.getContext("2d");
        this.ctxBG = canvasBG.getContext("2d");
        this.ctxGrid = canvasGrid.getContext("2d");

        //Draw background
        var imgBG = new Image();
        imgBG.onload = function(){
            // create pattern
            var ptrn = that.ctxBG.createPattern(imgBG, 'repeat'); // Create a pattern with this image, and set it to "repeat".
            that.ctxBG.fillStyle = ptrn;
            that.ctxBG.fillRect(0, 0, that.ctxBG.canvas.width, that.ctxBG.canvas.height); // context.fillRect(x, y, width, height);
        }
        imgBG.src = 'https://www.torn.com/images/v2/christmas_town/snow.jpg';

        //Draw grid
        var imgGrid = new Image();
        imgGrid.onload = function(){
            // create pattern
            var ptrn = that.ctxGrid.createPattern(imgGrid, 'repeat'); // Create a pattern with this image, and set it to "repeat".
            that.ctxGrid.fillStyle = ptrn;
            that.ctxGrid.fillRect(0, 0, that.ctxGrid.canvas.width, that.ctxGrid.canvas.height); // context.fillRect(x, y, width, height);
        }
        imgGrid.src = 'https://www.torn.com/images/v2/christmas_town/map_grid.png';

        if(file){
            var img = new Image;
            img.onload = function() {
                that.ctx.drawImage(img, 0, 0);

                that.drawMap = true;
                that.draw();
            }
            img.src = URL.createObjectURL(file);
        }
        else{
            this.drawMap = true;
            this.draw();
        }
    }

    drawOnMap(){
        if(this.drawMap){
            let drawingObjects = [];

            let adminMap = document.querySelector('.admin-map');

            let world = document.getElementById('world');
            let worldTransform = world.style.transform.replace('translate(','').replace(')','').replace(/px/g,'').split(',').map(x => {return Number(x) * -1});

            let negativeCoordinates = document.querySelector('.negative-coordinates');
            let objectsLayer = document.querySelector('.objects-layer');
            let objects = objectsLayer.querySelectorAll('.ct-object');

            let negativeX = Number(negativeCoordinates.style.left.replace('px','') || 0);
            let negativeY = Number(negativeCoordinates.style.top.replace('px','') || 0);

            let mapOverview = document.querySelector('.map-overview');

            let tilesaround = (adminMap ? 0 : 1);
            let tileSize = 30;

            let player = {
                x: worldTransform[0] + (mapOverview.clientWidth / 2) - this.drawOffset.x,
                y: worldTransform[1] + (mapOverview.clientWidth / 2) - this.drawOffset.y,
                halfW: (mapOverview.clientWidth / 2) + (tilesaround * tileSize),
                halfH: (mapOverview.clientWidth / 2) + (tilesaround * tileSize)
            };

            this.ctxTemp.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

            for(let object of objects){
                let dx = negativeX + Number(object.style.left.replace('px','')) - this.drawOffset.x;
                let dy = negativeY + Number(object.style.top.replace('px','')) - this.drawOffset.y;
                let image = object.querySelector('img');

                if(image && image.complete && image.naturalHeight !== 0){
                    this.ctxTemp.drawImage(image, dx, dy);
                }
            }

            this.ctx.clearRect(player.x-player.halfW, player.y-player.halfH, player.halfW * 2, player.halfH * 2);

            this.ctx.drawImage(this.ctxTemp.canvas,
                               player.x-player.halfW, player.y-player.halfH, player.halfW * 2, player.halfH * 2, //source
                               player.x-player.halfW, player.y-player.halfH, player.halfW * 2, player.halfH * 2 //destination
                              );

            this.autoScrollMap();
        }
    }

    autoScrollMap(){

        let world = document.getElementById('world');
        let worldTransform = world.style.transform.replace('translate(','').replace(')','').replace(/px/g,'').split(',').map(x => {return Number(x) * -1});

        let negativeCoordinates = document.querySelector('.negative-coordinates');
        let mapOverview = document.querySelector('.map-overview');
        //let mapControls = document.querySelector('.map-controls');

        let negativeX = Number(negativeCoordinates.style.left.replace('px','') || 0);
        let negativeY = Number(negativeCoordinates.style.top.replace('px','') || 0);

        let player = {
            //x: (mapControls ? Number(mapControls.style.left.replace('px','')) : 0) + negativeX + mapOverview.clientWidth / 2,
            //y: (mapControls ? Number(mapControls.style.top.replace('px','')) : 0) + negativeY + mapOverview.clientWidth / 2,
            x: worldTransform[0] + (mapOverview.clientWidth / 2) - this.drawOffset.x,
            y: worldTransform[1] + (mapOverview.clientWidth / 2) - this.drawOffset.y,
            halfW: (mapOverview.clientWidth / 2),
            halfH: mapOverview.clientWidth / 2
        };

        let zoom = Number(document.getElementById('ctMapDrawerCanvasContainer').style.zoom.replace('%','')) / 100;

        this.container.scroll({
            top: player.y * zoom - this.container.clientHeight/2,
            left: player.x * zoom - this.container.clientWidth/2,
            behavior: 'smooth'
        })

        //Update player size / position
        let divPlayer = document.getElementById('ctMapDivPlayer');
        let divPlayerW = 20 * ((1/zoom) < 1 ? 1 : (1/zoom));
        let divPlayerH = 20 * ((1/zoom) < 1 ? 1 : (1/zoom));
        divPlayer.style.width = divPlayerW + 'px';
        divPlayer.style.height = divPlayerH + 'px';
        divPlayer.style.top = player.y - (divPlayerH/2) + 'px';
        divPlayer.style.left = player.x - (divPlayerW/2) + 'px';
    }

    addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    saveImage(e, mode){
        e.preventDefault();

        let world = document.getElementById('world');

        let exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.drawSize//Number(world.style.width.replace('px',''));
        exportCanvas.height = this.drawSize//Number(world.style.height.replace('px',''));

        let ctxExport = exportCanvas.getContext("2d");

        if(mode == 'export'){
            //check for blueprint mode
            if(confirm("Export image in blueprint mode?")){
                ctxExport.filter = 'brightness(150%) contrast(10%)';
            }

            //check for background
            if(confirm("Add background to export image?")){
                //Draw background image
                ctxExport.drawImage(this.ctxBG.canvas,
                                    0, 0, exportCanvas.width, exportCanvas.height, //source
                                    0, 0, exportCanvas.width, exportCanvas.height //destination
                                   );
            }
        }

        //Draw main image
        ctxExport.drawImage(this.ctx.canvas,
                            0, 0, exportCanvas.width, exportCanvas.height, //source
                            0, 0, exportCanvas.width, exportCanvas.height //destination
                           );



        if(mode == 'export'){
            //check for grid
            if(confirm("Add grid to export image?")){
                //Draw background image
                ctxExport.drawImage(this.ctxGrid.canvas,
                                    0, 0, exportCanvas.width, exportCanvas.height, //source
                                    0, 0, exportCanvas.width, exportCanvas.height //destination
                                   );
            }
        }


        let mapTitle = document.querySelector('#christmastownroot .status-title');
        let mapTitle2 = document.querySelector('#christmastownroot .title-wrap .text');
        let mapName = "ctMap.png";

        if(mapTitle && mapTitle.childNodes[0]){
            mapName = mapTitle.childNodes[0].data + '.png';
        }
        if(mapTitle2 && mapTitle2.childNodes[0]){
            mapName = mapTitle2.innerHTML + '.png';
        }


        //Download image
        exportCanvas.toBlob(function(blob) {
            let link = document.createElement("a");
            link.download = mapName;
            link.href = URL.createObjectURL(blob);
            link.click();
        }, "image/png");
    }

    draw(){
        var that = this;
        setTimeout(function(){that.drawOnMap();},200);
    }
}