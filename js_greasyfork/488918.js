// ==UserScript==
// @name         flowr.fun - un-grey custom petals
// @namespace    http://tampermonkey.net/
// @version      2024-03-03
// @description  it looks better this way. >:(
// @author       Ly
// @license      MIT
// @match        https://flowr.fun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowr.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488918/flowrfun%20-%20un-grey%20custom%20petals.user.js
// @updateURL https://update.greasyfork.org/scripts/488918/flowrfun%20-%20un-grey%20custom%20petals.meta.js
// ==/UserScript==

PetalContainer = class PetalContainer {
    constructor(petals, {x,y,w,h,originalX,originalY,radius,toOscillate,isDragging,lastSlot,toRenderText,petalStats,customBiome}, id, amount, attempt){
        this.petals = petals;
        this.petalStats = petalStats;
        for(let i = 0; i < this.petals.length; i++){
            this.petals[i].insidePetalContainer = true;
        }
        this.rarity = (this.petals[0] ?? {rarity: 0}).rarity;
        this.type = (this.petals[0] ?? {type: 'Basic'}).type;
        if(this.type === "Custom" || this.type === "CustomProjectile"){
            this.type = this.petals[0].customType;
        }

        this.randomAngle = Math.random() * Math.PI * 2;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.radius = radius;

        this.render = {x: originalX ?? this.x, y: originalY ?? this.y, w: this.w/*w should be the same as height, idk why i wrote it this way*/};

        this.amount = amount;// when dragged and dropped, amount will be 1. Amount 1 (x1) doesn't render the x[number] (x2, x3, etc.) in the corner but the same class does if amount != 1;

        this.attempt = attempt;

        this.id = id;

        this.spawnAnimation = 0;

        this.lastAmountChangedTime = -1000;
        this.collectTime = null;

        this.toOscillate = toOscillate !== false;
        if(this.toOscillate === true){
            this.angleOffset = Math.PI * .05 * (Math.random() * 2 - 1);
        }

        this.creationTime = performance.now();

        this.isDraggingPetalContainer = isDragging ?? false;
        if(this.isDraggingPetalContainer === true){
            this.lastPetalSlot = lastSlot ?? {index: -1, top: true};
        }

        if(toRenderText !== undefined){
            this.toRenderText = false;
        }

        this.isHovered = false;
        this.statsBoxAlpha = 0;
        this.statsBox = null;

        if(customBiome !== undefined){
            this.customBiome = customBiome;
            this.greyed = false;
        }


    }

    updateInterpolate(){
        this.render.x = interpolate(this.render.x, this.x, 0.00672 * dt);
        this.render.y = interpolate(this.render.y, this.y, 0.00672 * dt);
        this.render.w = interpolate(this.render.w, this.w, 0.00672 * dt);
        if(this.collectTime) {
            this.spawnAnimation = interpolate(this.spawnAnimation, 0, 0.00672 * dt);
        } else {
            this.spawnAnimation = interpolate(this.spawnAnimation, 1, 0.00672 * dt);
        }
    }
    drawStatsBox(drawBelow=false){
        if(window.statBoxes === false){
			return;
		}
        if(this.isHovered === true){
            if(this.statsBox === null){
                let lastOscillating = this.toOscillate;
                let lastDimensions = {w: this.w, h: this.h};
                this.w = 58;
                this.h = 58;
                this.toOscillate = false;
                this.statsBox = generateStatsBox(this, true,
                    {
                        x: this.x,
                        y: this.y
                    }
                )
                this.w = lastDimensions.w;
                this.h = lastDimensions.h;
                this.toOscillate = lastOscillating;
            }
            this.statsBoxAlpha += 0.15 * dt / 18;
            if(this.statsBoxAlpha > 1){
                this.statsBoxAlpha = 1;
            }

            ctx.globalAlpha = this.statsBoxAlpha;
        } else {
            this.statsBoxAlpha -= 0.15 * dt / 18;
            if(this.statsBoxAlpha < 0){
                this.statsBoxAlpha = 0;
            }
        }
        if(this.statsBoxAlpha !== 0){
            this.statsBox.x = this.render.x - this.statsBox.w / 2
            this.statsBox.y = drawBelow
                ? this.render.y + this.h / 2 + 11.5
                : this.render.y - this.statsBox.h - this.h / 2 - 11.5;
            ctx.globalAlpha = this.statsBoxAlpha;
            this.statsBox.pc.amount = this.amount;
            this.statsBox.draw();
            ctx.globalAlpha = 1;
        }
        this.isHovered = false;
    }
    draw(inGame, number){
        this.updateInterpolate();

        if(this.toOscillate === true && toRender({x: this.render.x, y: this.render.y, radius: this.radius}, window.camera) === false && this.toSkipCulling !== true){
            return;
        }

        const renderAnimationTimer = smoothstep(this.spawnAnimation);

        let scale = 1;
        let rotation = 0;

        ctx.lastTransform = ctx.getTransform();
        // ctx.save();
        ctx.translate(this.render.x, this.render.y);
        scale *= renderAnimationTimer * this.render.w / 50;

        // ctx.scale(renderAnimationTimer * this.render.w / 50, renderAnimationTimer * this.render.w / 50);
        // ctx.rotate(-(1 - renderAnimationTimer) * Math.PI * 3);
        rotation -= (1 - renderAnimationTimer) * Math.PI * 3;
        if(this.isDraggingPetalContainer === true){
            if(this.draggingTimer === undefined)this.draggingTimer = 0;
            this.draggingTimer += 1000 / 30 * dt/16.66;
            // ctx.rotate(Math.sin(this.draggingTimer / 280) * 0.28);
            rotation += Math.sin(this.draggingTimer / 280) * 0.28;
            if(this !== draggingPetalContainer){
                this.isDraggingPetalContainer = false;
                this.undraggingPetalContainerTimer = 30;
                // this.lastDraggingTimer = this.draggingTimer;
                this.lastDraggingAngle = Math.sin(this.draggingTimer / 280) * 0.28;
                // this.draggingTimer = Math.sin(this.draggingTimer / 300) * 0.3;
            }
        } else if(this.undraggingPetalContainerTimer !== undefined){
            if(this.interval === undefined){
                // this.lastDraggingTimer += 1000 / 30;
                // if(Math.abs(Math.sin(this.lastDraggingTimer / 300) * 0.3) < Math.abs(this.draggingTimer)){
                //     this.draggingTimer = Math.sin(this.lastDraggingTimer / 300) * 0.3;
                // }
                this.lastDraggingAngle = interpolate(this.lastDraggingAngle, 0, 0.15);
                // ctx.rotate(this.lastDraggingAngle);
                rotation += this.lastDraggingAngle;
                this.undraggingPetalContainerTimer--;
                if(this.undraggingPetalContainerTimer < 0){
                    delete this.undraggingPetalContainerTimer;
                    // delete this.lastDraggingTimer;
                    delete this.lastDraggingAngle;
                    delete this.draggingTimer;
                }

                // this.undraggingPetalContainerTimer = 30;
                // // this.draggingTimer /= 300;
                // // this.draggingTimer = this.draggingTimer % (Math.PI * 2);
                // // this.draggingTimer *= 300;
                // this.draggingTimer = Math.sin(this.draggingTimer / 300) * 0.3;// it becomes an angle now
                // this.interval = setInterval(() => {
                //     this.draggingTimer = interpolateDirection(this.draggingTimer, Math.PI / 2, 0.1);
                //     this.undraggingPetalContainerTimer--;
                //     if(this.undraggingPetalContainerTimer < 0){
                //         clearInterval(this.interval);
                //         delete this.undraggingPetalContainerTimer;
                //     }
                // }, 1000 / 30);
            }
        }

        if(this.toOscillate === true){
            scale *= 1+Math.sin(performance.now()/ 1000 / .076)/52;
            // ctx.scale(1+Math.sin(performance.now()/ 1000 / .076)/52,1+Math.sin(performance.now()/ 1000 / .076)/52);
            // ctx.rotate(this.angleOffset);
            rotation += this.angleOffset;
        }

        // if(Math.abs(scale * 60 - this.renderImageSize) > 10){
        //     this.generateRenderImage(scale * 60 * canvas.zoom);
        // }
        // ctx.drawImage(this.renderImage, -this.renderImageSize/2/canvas.zoom, -this.renderImageSize/2/canvas.zoom, this.renderImageSize/canvas.zoom, this.renderImageSize/canvas.zoom/*, -30 * scale, -30 * scale, 60 * scale, 60 * scale*/);
        // ctx.scale(8,8);

        // ___ start ___
        if(rotation !== 0)ctx.rotate(rotation);
        if(scale !== 1)ctx.scale(scale, scale);
        if(this.toOscillate === true && this.isDisplayPetalContainer !== true){
            // bigger grey border
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.roundRect(-30, -30, 60, 60, 5);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;
        }

        // draw rect
        ctx.lineWidth = 4.5;

        // greyed if and only if its a custom petal in an official biome
        // this.greyed = false;
        this.greyed = (this.customBiome !== undefined && window.officialBiomes.includes(biomeManager.getCurrentBiome()) === true);
        if(this.type === 'soccer petal' && biomeManager.getCurrentBiome() !== 'Soccer!') this.greyed = true;
        this.greyed = false
        if(this.greyed){
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = "#525252";
            ctx.strokeStyle = "#404040";
        } else {
            ctx.fillStyle = Colors.rarities[this.rarity].color;
            ctx.strokeStyle = Colors.rarities[this.rarity].border;
        }

        // if (this.rarity == 8){
        //     ctx.fillStyle = `hsl(${Math.cos(Date.now()/1200)*20 + 35}, 68%, 60%)`
        //     ctx.strokeStyle = `hsl(${Math.cos(Date.now()/1200)*20 + 35}, 68%, 45%)`

        // }

        if (this.rarity == 12){
            const gradientFill = ctx.createLinearGradient(-30, -30, 30, 30);
            gradientFill.addColorStop(0, `hsl(${Math.cos(Date.now()/400)*35 + 285}, 100%, 20%)`);
            gradientFill.addColorStop(0.25, `hsl(${Math.cos(Date.now()/400 + 1.5)*35 + 285}, 100%, 20%)`);
            gradientFill.addColorStop(0.5, `hsl(${Math.cos(Date.now()/400 + 3)*35 + 285}, 100%, 20%)`)
            gradientFill.addColorStop(0.75, `hsl(${Math.cos(Date.now()/400 + 4.5)*35 + 285}, 100%, 20%)`)
            gradientFill.addColorStop(1, `hsl(${Math.cos(Date.now()/400 + 6)*35 + 285}, 100%, 20%)`)
             //ctx.fillStyle = `hsl(${Math.cos(Date.now()/400)*35 + 285}, 100%, 15%)`
            ctx.fillStyle = gradientFill;
            ctx.strokeStyle = "black";

        }

        ctx.beginPath();
        ctx.roundRect(-25, -25, 50, 50, .25);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if(this.rarity == 12){
            ctx.save();
            //shiny stars & stuff
            if(!this.stars){
                this.stars = [];
                for(let starnum = 0; starnum < 2; starnum++){
                    this.stars.push({x: Math.random()*50 - 25, y: Math.random()*50 - 25})
                }
            }
            ctx.shadowBlur = 20;
            ctx.shadowColor = "white";
            ctx.fillStyle = "#ffffff";
            for(let star of this.stars){
                star.x+=0.1;
                star.y+=0.1;
                if(star.x >30 || star.y >30){
                    star.x = Math.random()*800 - 20 - 30;
                    star.y = -30;

                }

                if(star.x < -30 || star.x > 30 || star.y < -30 || star.y > 30){
                    //don't draw;
                    continue;
                }
                ctx.beginPath();

                var grad = ctx.createRadialGradient(star.x, star.y,15,star.x, star.y,0);
                grad.addColorStop(0,"transparent");
                grad.addColorStop(0.8,`rgba(255,255,255,${(Math.cos(Date.now()/600+ star.x/30 + star.y/30) + 1)*0.8})`);
                grad.addColorStop(1,"white");

                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.3;

                ctx.fillRect(-20.5, -20.5, 41,41);
                ctx.globalAlpha = 1;
                if(star.x < 20.5 && star.x > -20.5 && star.y < 20.5 && star.y > -20.5){

                    ctx.fillStyle = "#fff";

                    ctx.arc(star.x, star.y, 1, 0, 2*Math.PI);
                    ctx.fill();
                }
                ctx.closePath();
            }
            ctx.restore();
        }

        //draw reload stuff
        if (inGame){
            if (petalReloadData[number]){
                if (petalReloadData[number].reload > 0.001 && petalReloadData[number].reload < 0.999){
                    ctx.save();
                    ctx.beginPath();
                    ctx.roundRect(-25, -25, 50, 50, .25);
                    ctx.clip();

                    ctx.globalAlpha = 0.3;
                    ctx.lineCap = "butt";

                    let offset = (1-Math.pow(petalReloadData[number].reload, 0.7))*Math.PI*6 + this.randomAngle;

                    ctx.strokeStyle = "#000000";
                    ctx.lineWidth = 50;
                    ctx.beginPath();
                    ctx.arc(0, 0, 25, offset - Math.PI * 2 * smoothstep(petalReloadData[number].reload), offset);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.restore();
                }
            }
        }

        if(this.greyed)ctx.globalAlpha = 1;

        if(this.toRenderText === false){
            ctx.translate(0, 3.5);
        }

        if(this.type === 'Wing'){
            ctx.translate(0, -1.8);
        }

        // // no need for an arc, just draw the petal
        if(this.petals.length === 1){
            this.petals[0].render.x = 0//this.x;
            this.petals[0].render.y = 0//this.y - this.h / 10;

            let scaleMult = .8;
            if(this.petals[0].radius * .8 > 13.25/2){
                scaleMult = 13.25/(this.petals[0].radius*.8)/2;
            }
            if(petalContainerRenderSizeMultsMap[this.petals[0].type] !== undefined){
                if (typeof petalContainerRenderSizeMultsMap[this.petals[0].type] == "object"){
                    if (petalContainerRenderSizeMultsMap[this.petals[0].type][this.petals[0].rarity]){
                        scaleMult *= petalContainerRenderSizeMultsMap[this.petals[0].type][this.petals[0].rarity];
                    }
                }
                else{
                    scaleMult *= petalContainerRenderSizeMultsMap[this.petals[0].type];
                }
            }

            let individualRotate = false;
            if(petalContainerIndividualRotate[this.petals[0].type] !== undefined){
                if (typeof petalContainerIndividualRotate[this.petals[0].type] == "object"){
                    if (petalContainerIndividualRotate[this.petals[0].type][this.petals[0].rarity]){
                        individualRotate = petalContainerIndividualRotate[this.petals[0].type][this.petals[0].rarity];
                    }
                }
                else{
                    individualRotate = petalContainerIndividualRotate[this.petals[0].type];
                }
            }

            // ctx.translate(0, -4);
            // ctx.scale(scaleMult, scaleMult);
            // if (individualRotate !== false)ctx.rotate(individualRotate)
            let last = {y: this.petals[0].render.y, selfAngle: this.petals[0].selfAngle};
            this.petals[0].render.y -= 4;
            this.petals[0].scaleMult = scaleMult;
            if(individualRotate !== false)this.petals[0].selfAngle += individualRotate;

            if(this.greyed === true)window.alphaMult = 0.4;
            this.petals[0].draw();
            // if (individualRotate !== false)ctx.rotate(-individualRotate)
            // ctx.scale(1/scaleMult,1/scaleMult);
            // ctx.translate(0, 4);
            this.petals[0].render.y = last.y;
            delete this.petals[0].scaleMult;
            this.petals[0].selfAngle = last.selfAngle;
            // console.log(this.petals[0], ctx.getTransform());
        } else {
            // todo: generate positions in init instead of recalcing every frame, its not like we're gonna be adding more petals to an existing petal slot
            let petalRadius = (this.petals[0] ?? {radius: 0}).radius;
            if((this.petals[0] ?? {type: 'not peas'}).type === 'Peas'){
                petalRadius -= 0.2;
            }
            let radius = Math.min(petalRadius * 1.16, 25 - petalRadius);
            // if(this.petals.length === 3){
            //     // odd
            //     ctx.translate(-1, 0);
            // }

            let greaterThanMargin = petalRadius * .8 + radius - 13.25;
            if(greaterThanMargin > 0){
                radius -= greaterThanMargin;
                if(radius < 8){
                    greaterThanMargin = 8-radius;
                    radius = 8;

                    // radius *= 1 / (greaterThanMargin/(13.25)+1);
                    petalRadius *= 1 / (greaterThanMargin/13.25+1);
                    // petalRadius = Math.max(8, petalRadius);
                    for(let i = 0; i < this.petals.length; i++){
                        this.petals[i].radius = petalRadius;
                    }
                }
            }
            if (petalContainerMultPetalRadiusMap[this.petals[0].type] !== undefined){
                if (typeof petalContainerMultPetalRadiusMap[this.petals[0].type] == "object"){
                    if (petalContainerMultPetalRadiusMap[this.petals[0].type][this.petals[0].rarity]){
                        radius *= petalContainerMultPetalRadiusMap[this.petals[0].type][this.petals[0].rarity];
                    }
                }
                else{
                    radius *= petalContainerMultPetalRadiusMap[this.petals[0].type];
                }
            }
            let toPointToCenter = ['Stinger'].includes((this.petals[0] ?? {type: "Basic"}).type) && (this.petals[0] ?? {rarity: 0}).rarity > 5;
            if (toPointToCenter == true){
                toPointToCenter = 0;
            }
            if (pointToCenterPetals[this.petals[0].type] !== undefined){
                if (typeof pointToCenterPetals[this.petals[0].type] == "object"){
                    if (pointToCenterPetals[this.petals[0].type][this.petals[0].rarity]){
                        toPointToCenter = pointToCenterPetals[this.petals[0].type][this.petals[0].rarity];
                    }
                }
                else{
                    toPointToCenter = pointToCenterPetals[this.petals[0].type];
                }
            }
            for(let i = 0; i < this.petals.length; i++){
                let rotateOffset = 0;
                if (petalContainerRotateMap[this.petals[0].type]){
                    rotateOffset = petalContainerRotateMap[this.petals[0].type];
                }
                const angle = Math.PI * 2 * i / this.petals.length + rotateOffset;
                this.petals[i].render.x = 0//this.x + Math.cos(angle) * radius;
                this.petals[i].render.y = 0//this.y + Math.sin(angle) * radius - this.h / 10;

                let scaleMult = .8;
                if(petalContainerRenderSizeMultsMap[this.petals[0].type] !== undefined){
                    if (typeof petalContainerRenderSizeMultsMap[this.petals[0].type] == "object"){
                        if (petalContainerRenderSizeMultsMap[this.petals[0].type][this.petals[0].rarity]){
                            scaleMult *= petalContainerRenderSizeMultsMap[this.petals[0].type][this.petals[0].rarity];
                        }
                    }
                    else{
                        scaleMult *= petalContainerRenderSizeMultsMap[this.petals[0].type];
                    }
                }

                let last = {x: this.petals[i].render.x, y: this.petals[i].render.y, selfAngle: this.petals[i].selfAngle};
                this.petals[i].render.x += Math.cos(angle) * radius * scaleMult/.8;
                this.petals[i].render.y += Math.sin(angle) * radius * scaleMult/.8 - 4;
                this.petals[i].scaleMult = scaleMult;
                if(toPointToCenter !== false)this.petals[i].selfAngle += angle+Math.PI+toPointToCenter;
                // ctx.translate(Math.cos(angle) * radius * scaleMult/.8, Math.sin(angle) * radius * scaleMult/.8 - 4);
                // ctx.scale(scaleMult, scaleMult);
                // if(toPointToCenter !== false)ctx.rotate(angle+Math.PI+toPointToCenter);
                if(this.greyed === true)window.alphaMult = 0.4;
                this.petals[i].draw();
                this.petals[i].render.x = last.x;
                this.petals[i].render.y = last.y;
                delete this.petals[i].scaleMult;
                this.petals[i].selfAngle = last.selfAngle;
                // if(toPointToCenter !== false)ctx.rotate(-angle-Math.PI-toPointToCenter);
                // ctx.scale(1/scaleMult, 1/scaleMult);
                // ctx.translate(-Math.cos(angle) * radius * scaleMult/.8, -Math.sin(angle) * radius * scaleMult/.8 + 4);
            }

            // if(this.petals.length === 3){
            //     // odd
            //     ctx.translate(1, 0);
            // }
        }

        if(this.type === 'Wing'){
            ctx.translate(0, 1.8);
        }

        if(this.toRenderText === false){
            ctx.translate(0, -3.5);
        }

        if(this.toRenderText === undefined){
            if(this.type === "Dandelion"){
                ctx.font = '900 8.5px Ubuntu';
                ctx.letterSpacing = "-.1px";
            } else if(this.type === "Lightning" || this.type === "Pentagon"){
                ctx.font = '900 9.5px Ubuntu';
                ctx.letterSpacing = "-.1px";
            } else {
                ctx.font = '900 11px Ubuntu';
                ctx.letterSpacing = "-.05px";
            }
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';

            // const canvasScale = ctx.getTransform().m11;
            ctx.lineWidth = 1.35;//5//Math.ceil(1.25 / canvasScale);

            ctx.fontKerning = "none";

            let type = this.type;
            if (type == "Fire Missile"){
                type = "Missile";
            }
            if(this.greyed) ctx.globalAlpha = 0.3;
            ctx.strokeText(type, 0, 13.25);
            ctx.fillText(type, 0, 13.25);
            ctx.globalAlpha = 1;
        }

        if(scale !== 1)ctx.scale(1/scale, 1/scale);
        if(rotation !== 0)ctx.rotate(-rotation);
        // ___ end ___

        if(this.amount !== 1 || (performance.now() - this.lastAmountChangedTime < 240)){
            if(performance.now() - this.lastAmountChangedTime < 240){
                ctx.globalAlpha = smoothstep((performance.now() - this.lastAmountChangedTime) / 240);
            }
            if(this.amount === 1){
                ctx.globalAlpha = 1 - ctx.globalAlpha;
            }
            ctx.font = `600 ${13 * scale}px Ubuntu`;
            ctx.letterSpacing = "1px";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.translate((70/(2.5) + .5) * scale, (-42/(2.5) + .5) * scale);
            ctx.rotate(Math.PI / 9.1);
            if(this.greyed) ctx.globalAlpha *= 0.3;
            ctx.strokeText('x' + (this.amount === 1 ? 2 : formatAmount(this.amount)), 0, 0);
            ctx.fillText('x' + (this.amount === 1 ? 2 : formatAmount(this.amount)), 0, 0);
            ctx.globalAlpha = 1;
        }
  ctx.setTransform(ctx.lastTransform);
        delete ctx.lastTransform;
    }
}