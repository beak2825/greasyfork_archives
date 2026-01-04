// ==UserScript==
// @name         Flowr QoL
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A QoL script for Flowr!
// @author       Suprinister
// @match        https://flowr.fun/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      Apache-2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524837/Flowr%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/524837/Flowr%20QoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Colors.rarities[9] = {"name":"Fabled","color":"#ff5500","border":"#cf4500","fancy":{"border":"#cf4500","hue":10,"light":60,"sat":95,"spread":20,"period":1.5}};

    const ogColors = JSON.parse(JSON.stringify(Colors.rarities));

    let pressedG = false;

    window.addEventListener('keydown', event => {
        if (event.code === 'KeyG') {
            pressedG = true;
        };
    });

    window.addEventListener('keyup', event => {
        if (event.code === 'KeyG') {
            pressedG = false;
        };
    });

    let performanceMode = (localStorage.getItem('performanceMode') ?? 'false') === 'false' ? false : true;

    if (performanceMode) {
        for (let i = 0; i < Colors.rarities.length; i++) {
            delete Colors.rarities[i].fancy;
        };

        blendAmount = function(p) {
            return 0;
        };
    };

    for (let i = 7; i <= 12; i++) {
        settingsMenu.options[i].screenPosition.y += 50;
    };

    settingsMenu.options.splice(7, 0, {
        changeTime: 0,
        name: 'Performance mode',
        screenPosition: {
            x: 125,
            y: 386,
            w: 28,
            h: 28
        },
        state: performanceMode,
        toggleFn(state) {
            performanceMode = state;
            localStorage.setItem('performanceMode', state);

            if (state) {
                for (let i = 0; i < Colors.rarities.length; i++) {
                    delete Colors.rarities[i].fancy;
                };

                blendAmount = function(p) {
                    return 0;
                };
            } else {
                Colors.rarities = JSON.parse(JSON.stringify(ogColors));

                blendAmount = function(p) {
                    return Math.max(0, 1 - p.ticksSinceLastDamaged / 166.5);
                };
            };
        },
        type: 'toggle'
    });

    settingsMenu.h += 50;
    settingsMenu.offset = -settingsMenu.h - 40;
    settingsMenu.targetOffset = -settingsMenu.h - 40;

    Flower.prototype.draw = function() {
        if(this.id !== window.selfId){
            this.updateInterpolate();
        }

        this.updatePetsAndProjectiles();

        for(let i = 0; i < this.deadProjectiles.length; i++){
            if(toRender({x: this.deadProjectiles[i].render.x, y: this.deadProjectiles[i].render.y, radius: this.deadProjectiles[i].radius}, window.camera) === true){
                this.deadProjectiles[i].draw();
            }
            this.deadProjectiles[i].updateTimer();
        }

        

        this.ticksSinceLastDamaged += dt;
        if(this.ticksSinceLastDamaged > 666){
            this.beforeStreakHp = this.hp;
        }
        
        renderHpBar({
            x: this.render.headX,
            y: this.render.headY - this.render.radius / 3,
            radius: this.render.radius,
            hp: this.render.hp,
            maxHp: this.maxHp,
            shield: this.render.shield,
            beforeStreakHp: this.render.beforeStreakHp,
            flowerName: this.name,
            flowerUsername: this.username
        },this);

        if(this.petalAlpha !== undefined){
            ctx.globalAlpha = this.petalAlpha;
        }

        if (this.id == window.selfId){
            petalReloadData = {};
            petalHpData = {};
        }
        for(let i = 0; i < this.petals.length; i++){
            let petal = this.petals[i];
            if(toRender({x: petal.render.x, y: petal.render.y, radius: petal.radius}, window.camera) === true){
                if (!petal.dead && pressedG) {
                    ctx.beginPath();

                    ctx.font = '900 12px Ubuntu';
                    ctx.lineWidth = 5;
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = Colors.rarities[petal.rarity].color;
                    ctx.strokeStyle = 'black';
                    ctx.strokeText(Colors.rarities[petal.rarity].name, petal.render.x, petal.render.y + petal.radius * 1.75 + 7);
                    ctx.fillText(Colors.rarities[petal.rarity].name, petal.render.x, petal.render.y + petal.radius * 1.75 + 7);

                    ctx.globalAlpha = 0.5;
                    ctx.arc(petal.render.x, petal.render.y, petal.radius * 1.75, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.globalAlpha = 1;

                    ctx.closePath();
                };
                
                petal.draw();
            }
            if (this.id == window.selfId){
                let containerId = petal.petalContainerId;
                if (!petalReloadData[containerId]){
                    if (petal.dead){
                        petalReloadData[containerId] = {
                            reload: petal.render.reload/petal.maxReload
                        }
                    }
                }
                else{
                    if (petalReloadData[containerId].reload < petal.render.reload/petal.maxReload && petal.dead){
                        petalReloadData[containerId].reload = petal.render.reload/petal.maxReload;
                    }
                }

                if (!petalHpData[containerId]){
                    if (!petal.dead){
                        petalHpData[containerId] = {
                            hp: petal.render.hp/petal.maxHp,
                            count: 1
                        }
                    }
                }
                else{
                    if(!petal.dead){
                        petalHpData[containerId].hp = (petalHpData[containerId].count * petalHpData[containerId].hp + petal.render.hp/petal.maxHp)/(petalHpData[containerId].count+1);
                        petalHpData[containerId].count++;
                    }
                }
            }
            petal.updateTimer();
        }
        ctx.globalAlpha = 1;
        
        if(toRender({x: this.render.headX, y: this.render.headY, radius: this.render.radius}, window.camera) === true){
            this.drawFlower(this.render.headX, this.render.headY, this.radius);
        }
        if (this.lightnings){
            if (this.lightnings.length > 0){
                this.lightnings = this.lightnings.filter((e) => time < (e.time+600))
                ctx.strokeStyle = "#97f0ea";
                ctx.lineWidth = 3;
                for(let i of this.lightnings){
                    ctx.globalAlpha = (1-(time-i.time)/700);
                    ctx.beginPath();
                    for(let j = 0; j < i.renderData.length; j++){
                        ctx.lineTo(i.renderData[j].x, i.renderData[j].y);
                    }
                    ctx.stroke();
                    ctx.closePath();
                }
            }     
        }
    }

    PetalContainer.prototype.draw = function(inGame, number, crafting = false) {
        this.updateInterpolate();

        if(this.toOscillate === true && toRender({x: this.render.x, y: this.render.y, radius: this.radius}, window.camera) === false && this.toSkipCulling !== true){
            return;
        }

        const renderAnimationTimer = smoothstep(this.spawnAnimation);

        let scale = 1;
        let rotation = 0;

        ctx.lastTransform = ctx.getTransform();
        ctx.translate(this.render.x, this.render.y);
        scale *= renderAnimationTimer * this.render.w / 50;

        rotation -= (1 - renderAnimationTimer) * Math.PI * 3;
        if(this.isDraggingPetalContainer === true){
            if(this.draggingTimer === undefined)this.draggingTimer = 0;
            this.draggingTimer += 1000 / 30 * dt/16.66;
            rotation += Math.sin(this.draggingTimer / 280) * 0.28;
            if(this !== draggingPetalContainer){
                this.isDraggingPetalContainer = false;
                this.undraggingPetalContainerTimer = 30;
                this.lastDraggingAngle = Math.sin(this.draggingTimer / 280) * 0.28;
            }
        } else if(this.undraggingPetalContainerTimer !== undefined){
            if(this.interval === undefined){
                this.lastDraggingAngle = interpolate(this.lastDraggingAngle, 0, 0.15);
                rotation += this.lastDraggingAngle;
                this.undraggingPetalContainerTimer--;
                if(this.undraggingPetalContainerTimer < 0){
                    delete this.undraggingPetalContainerTimer;
                    delete this.lastDraggingAngle;
                    delete this.draggingTimer;
                }
            }
        }

        if(this.toOscillate === true){
            scale *= 1+Math.sin(performance.now()/ 1000 / .076)/52;
            rotation += this.angleOffset;
        }

        if(rotation !== 0)ctx.rotate(rotation);
        if(scale !== 1)ctx.scale(scale, scale);
        if(this.toOscillate === true && this.isDisplayPetalContainer !== true){
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.roundRect(-30, -30, 60, 60, 5);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;
        }

        ctx.lineWidth = 4.5;

        currentBiome = biomeManager.getCurrentBiome();
        this.greyed = (this.customBiome !== undefined && window.officialBiomes.includes(currentBiome) === true) || (crafting && this.amount < 5);
        if(this.type === 'soccer petal' && currentBiome !== 'Soccer!') this.greyed = true;
        if(this.greyed){
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = "#525252";
            ctx.strokeStyle = "#404040";
        } else {
            ctx.fillStyle = Colors.rarities[this.rarity].color;
            ctx.strokeStyle = Colors.rarities[this.rarity].border;
        }

        if((currentBiome === '1v1' && this.generatedIn1v1 === false) || (currentBiome !== '1v1' && this.generatedIn1v1 === true)){
            if(pregeneratedPvpStats === undefined) generatePvpStats();
            let statsToTake;
            if(currentBiome === '1v1'){
                statsToTake = pregeneratedPvpStats;
            } else {
                statsToTake = Stats;
            }

            if(this.petals.length !== 0 && this.petals[0].team !== undefined){
                statsToTake = statsToTake.enemies;
            } else {
                statsToTake = statsToTake.petals;
            }

            let petalAmount = 0;
            if(statsToTake[this.type] !== undefined && statsToTake[this.type][this.rarity] !== undefined){
                const petalLayout = statsToTake[this.type][this.rarity].petalLayout;
                if(petalLayout === undefined) petalAmount = 1;
                else {
                    for(let i = 0; i < petalLayout.length; i++){
                        for(let j = 0; j < petalLayout[i].length; j++){
                            petalAmount++;
                        }
                    }
                }
            } else {
                petalAmount = 1;
            }

            if(petalAmount < this.petals.length){
                this.petals.length = petalAmount;
            } else {
                while(this.petals.length < petalAmount){
                    this.petals.push(new Petal(this.petals[Math.floor(Math.random() * this.petals.length)]));
                }
            }
            this.generatedIn1v1 = !this.generatedIn1v1;
        }

        if (Colors.rarities[this.rarity].fancy !== undefined){
            const gradientFill = ctx.createLinearGradient(-30, -30, 30, 30);
            createFancyGradient(gradientFill, this.rarity);
            ctx.fillStyle = gradientFill;
            ctx.strokeStyle = Colors.rarities[this.rarity].fancy.border;
        }

        ctx.beginPath();
        ctx.roundRect(-25, -25, 50, 50, .25);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if(Colors.rarities[this.rarity].fancy !== undefined && Colors.rarities[this.rarity].fancy.stars !== undefined){
            ctx.save();
            if(!this.stars){
                this.stars = [];
                for(let starnum = 0; starnum < Colors.rarities[this.rarity].fancy.stars; starnum++){
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
            }else if(petalHpData[number]){
                if (petalHpData[number].hp > 0.001 && petalHpData[number].hp < 0.999){
                    ctx.save();
                    ctx.beginPath();
                    ctx.roundRect(-23, -23, 46, 46, .25);
                    ctx.clip();

                    ctx.globalAlpha = 0.3;
                    ctx.lineCap = "butt";

                    ctx.fillStyle = "#000000";
                    ctx.beginPath();
                    ctx.rect(-25, -25, 50, 50 * (1-petalHpData[number].hp));
                    ctx.fill();
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

        if(this.petals.length === 1){
            this.petals[0].render.x = 0
            this.petals[0].render.y = 0

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

            let last = {y: this.petals[0].render.y, selfAngle: this.petals[0].selfAngle};
            this.petals[0].render.y -= 4;
            this.petals[0].scaleMult = scaleMult;
            if(individualRotate !== false)this.petals[0].selfAngle += individualRotate;

            if(this.greyed === true)window.alphaMult = 0.4;
            this.petals[0].draw();
            this.petals[0].render.y = last.y;
            delete this.petals[0].scaleMult;
            this.petals[0].selfAngle = last.selfAngle;
        } else {
            let petalRadius = (this.petals[0] ?? {radius: 0}).radius;
            if((this.petals[0] ?? {type: 'not peas'}).type === 'Peas'){
                petalRadius -= 0.2;
            }
            let radius = Math.min(petalRadius * 1.16, 25 - petalRadius);

            let greaterThanMargin = petalRadius * .8 + radius - 13.25;
            if(greaterThanMargin > 0){
                radius -= greaterThanMargin;
                if(radius < 8){
                    greaterThanMargin = 8-radius;
                    radius = 8;
                    petalRadius *= 1 / (greaterThanMargin/13.25+1);
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
                this.petals[i].render.x = 0
                this.petals[i].render.y = 0

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
                if(this.greyed === true)window.alphaMult = 0.4;
                this.petals[i].draw();
                this.petals[i].render.x = last.x;
                this.petals[i].render.y = last.y;
                delete this.petals[i].scaleMult;
                this.petals[i].selfAngle = last.selfAngle;
            }
        }

        if(this.type === 'Wing'){
            ctx.translate(0, 1.8);
        }

        if(this.toRenderText === false){
            ctx.translate(0, -3.5);
        }

        if(this.toRenderText === undefined){
            if(this.type === "Dandelion" || this.type === "Neutron Star" || this.type === "Mini Flower"){
                ctx.font = '900 8.5px Ubuntu';
                ctx.letterSpacing = "-.1px";
            } else if(this.type === "Lightning" || this.type === "Pentagon" || this.type === "Hexagon" || this.type == "Plastic Egg"){
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
            ctx.lineWidth = 1.35;

            ctx.fontKerning = "none";

            let type = this.type;
            if (type == "Fire Missile"){
                type = "Missile";
            }
            if (type == "Dark Compass"){
                type = "Compass";
            }
            if (type == "Waterlogged Compass"){
                type = "Compass"
            }
            if (type == "Plastic Egg"){
                type = "Egg";
            }
            if (type == "Jellyfish Egg"){
                type = "Egg";
            }
            if (type == "Oranges" && this.rarity >= 12){
                type = "Orange";
            }

            if(this.greyed) ctx.globalAlpha = 0.3;
            ctx.strokeText(type, 0, 13.25);
            ctx.fillText(type, 0, 13.25);
            ctx.globalAlpha = 1;
        }

        if(scale !== 1)ctx.scale(1/scale, 1/scale);
        if(rotation !== 0)ctx.rotate(-rotation);

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
    };

    craftingMenu.drawInventory = function(alpha = 1) {
        this.render.scroll = interpolate(this.render.scroll, this.scroll, 0.0070 * dt);

        if (alpha !== 1) {
            ctx.globalAlpha = alpha;
        }
        let translation = 0;
        if (time - this.lastCloseTime < 160) {
            translation += this.h * easeOutCubic((time - this.lastCloseTime) / 160);
        }
        if (time - this.lastOpenTime < 160) {
            translation += (this.h + 40) - (this.h + 40) * easeOutCubic((time - this.lastOpenTime) / 160);
        }
        if (translation !== 0) {
            ctx.translate(0, translation);
        }

        ctx.translate(130, canvas.h - this.h - 20);
        ctx.fillStyle = this.getMainFill();
        ctx.strokeStyle = this.getMainStroke();
        ctx.lineWidth = 8;

        ctx.beginPath()
        ctx.roundRect(0, 0, this.w, this.h, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3.75;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 32px Ubuntu`;
        ctx.strokeText("Craft", this.w / 2, 29);
        ctx.fillText("Craft", this.w / 2, 29);

        if (this.craftingAnimationState === true) {
            this.runCraftingAnimation();
        }
        if (this.craftingAnimationState === "display") {
            this.displayPetalContainer.x = this.craftingPetalSlotsDimensions.x + this.displayPetalContainer.render.w * .35;
            this.displayPetalContainer.y = this.craftingPetalSlotsDimensions.y + this.displayPetalContainer.render.h * .35;
            this.displayPetalContainer.render.x = this.displayPetalContainer.x;
            this.displayPetalContainer.render.y = this.displayPetalContainer.y;
            this.displayPetalContainer.draw();
        } else {
            for (let i = 0; i < this.craftingPetalSlots.length; i++) {
                ctx.fillStyle = '#b17f49';
                ctx.beginPath();
                ctx.roundRect(this.craftingPetalSlots[i].x, this.craftingPetalSlots[i].y, this.craftingPetalSlots[i].w, this.craftingPetalSlots[i].h, 8);
                ctx.fill();
                ctx.closePath();

                if (this.craftingPetalContainers[i] !== undefined) {
                    const pc = this.craftingPetalContainers[i];
                    pc.x = this.craftingPetalSlots[i].x + this.craftingPetalSlots[i].w / 2;
                    pc.y = this.craftingPetalSlots[i].y + this.craftingPetalSlots[i].h / 2;
                    pc.draw();
                }
            }
        }

        if (mouseInBox({ x: mouse.canvasX, y: mouse.canvasY }, { x: this.craftingButton.x - this.craftingButton.w / 2 + 130, y: this.craftingButton.y - this.craftingButton.h / 2 + canvas.h - this.h - 20, w: this.craftingButton.w, h: this.craftingButton.h }) === true && this.craftingAnimationState === false) {
            this.hoveringOverCraftButton = true;
        } else {
            this.hoveringOverCraftButton = false;
        }
        ctx.letterSpacing = "0px";
        let fillcolor = "#777777"
        let strokecolor = "#555555";
        if (this.craftingPetalContainers[0] !== undefined) {
            if (Colors.rarities[this.craftingPetalContainers[0].rarity + 1]) {
                fillcolor = Colors.rarities[this.craftingPetalContainers[0].rarity + 1].color;
                strokecolor = Colors.rarities[this.craftingPetalContainers[0].rarity + 1].border;

                if (this.hoveringOverCraftButton) {
                    fillcolor = blendColor(fillcolor, "#ffffff", 0.1);
                    strokecolor = blendColor(strokecolor, "#ffffff", 0.03)
                }
            }
        }
        ctx.lineWidth = 7;
        ctx.fillStyle = fillcolor;
        ctx.strokeStyle = strokecolor;
        ctx.beginPath();
        ctx.roundRect(this.craftingButton.x - this.craftingButton.w / 2, this.craftingButton.y - this.craftingButton.h / 2, this.craftingButton.w, this.craftingButton.h, 4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.25;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 22px Ubuntu`;
        ctx.strokeText("Craft", this.craftingButton.x, this.craftingButton.y);
        ctx.fillText("Craft", this.craftingButton.x, this.craftingButton.y);
        if (this.craftingPetalContainers[0]) {
            ctx.fillStyle = '#f0f0f0';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2.25;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `900 12px Ubuntu`;

            let attempt = this.craftingPetalContainers[0].attempt;
            if (attempt == undefined) {
                attempt = 0;
            }
            let chance = calculateChance(attempt, this.craftingPetalContainers[0].rarity)
            if (this.craftingAnimationTimer > 3000 && this.craftingAnimationData.successAmount > 0) {
                ctx.fillStyle = "#00ff00"
                ctx.strokeText("Success (-" + this.craftingAnimationData.lost + ")", this.craftingButton.x, this.craftingButton.y + 40);
                ctx.fillText("Success (-" + this.craftingAnimationData.lost + ")", this.craftingButton.x, this.craftingButton.y + 40);
            }
            else {
                ctx.strokeText("Attempt " + (attempt + 1), this.craftingButton.x, this.craftingButton.y + 60);
                ctx.fillText("Attempt " + (attempt + 1), this.craftingButton.x, this.craftingButton.y + 60);

                if (this.craftingPetalContainers[0].rarity >= 12){
                    ctx.strokeText(Math.floor(chance * 100) / 100 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                    ctx.fillText(Math.floor(chance * 100) / 100 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                }
                else{
                    ctx.strokeText(Math.floor(chance * 10) / 10 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                    ctx.fillText(Math.floor(chance * 10) / 10 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                }
            }

        }

        if (this.hoveringOverCraftButton === true || this.draggingHorizontalScrollBar === true || this.draggingScrollBar === true || this.hoveringOverHorizontalScrollBar === true || this.hoveringOverScrollBar === true) {
            setCursor('pointer');
        }

        ctx.save();

        ctx.beginPath();
        ctx.rect(this.inventorySpace.x, this.inventorySpace.y, this.fillingHorizontal ? this.inventorySpace.w + 24 : this.inventorySpace.w, this.inventorySpace.h);
        ctx.clip();
        ctx.closePath();

        this.firstPetalContainer = null;
        this.lastPetalContainer = null;

        const firstRarityX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * 0 + 3;
        const lastRarityX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * this.maxRarity - 6;
        this.totalPetalWidth = lastRarityX - firstRarityX;

        let maxTypeIndex = 0;
        for (let typeKey in this.petalContainers) {
            for (let i = 0; i <= Math.max(5, this.maxRarity); i++) {
                const rarityKey = i;
                const pcX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * rarityKey + 3 - this.render.horizontalScroll * (this.totalPetalWidth - this.inventorySpace.h);
                const pcY = 5 + this.petalContainerSize / 2 + this.typeIndexes[typeKey] * (this.petalContainerSize + 12) + 5 + this.inventorySpace.y - this.render.scroll * (this.totalPetalHeight - this.inventorySpace.h);
                if (this.typeIndexes[typeKey] > maxTypeIndex) {
                    maxTypeIndex = this.typeIndexes[typeKey];
                }
                if (this.fillerPetalSlots[typeKey] === undefined) {
                    this.fillerPetalSlots[typeKey] = {};
                }
                if (this.fillerPetalSlots[typeKey][rarityKey] === undefined) {
                    this.fillerPetalSlots[typeKey][rarityKey] = { render: { x: pcX, y: pcY } };
                }

                const fpc = this.fillerPetalSlots[typeKey][rarityKey];
                fpc.x = pcX;
                fpc.y = pcY;
                fpc.render.x = interpolate(fpc.render.x, fpc.x, 0.00672 * dt);
                fpc.render.y = interpolate(fpc.render.y, fpc.y, 0.00672 * dt);
                ctx.fillStyle = '#b17f49';

                if (this.petalContainers[typeKey][rarityKey] === undefined && fpc.render.x + this.petalContainerSize / 2 > this.inventorySpace.x * 0.9 && fpc.render.x + this.petalContainerSize / 2 < (this.inventorySpace.x + this.inventorySpace.w) * 1.2 && fpc.render.y + this.petalContainerSize / 2 > this.inventorySpace.y * 0.9 && fpc.render.y + this.petalContainerSize / 2 < (this.inventorySpace.y + this.inventorySpace.h) * 1.1) {
                    ctx.beginPath();
                    ctx.roundRect(fpc.render.x - this.petalContainerSize / 2, fpc.render.y - this.petalContainerSize / 2, this.petalContainerSize, this.petalContainerSize, 8);
                    ctx.fill();
                    ctx.closePath();
                }

                if (this.petalContainers[typeKey] !== undefined && this.petalContainers[typeKey][rarityKey] !== undefined) {
                    const pc = this.petalContainers[typeKey][rarityKey];
                    pc.x = pcX;
                    pc.y = pcY;

                    if (pc.render.x + pc.w / 2 > this.inventorySpace.x * 0.9 && pc.render.x - pc.w / 2 < (this.inventorySpace.x + this.inventorySpace.w) * 1.1 && pc.render.y + pc.w / 2 > this.inventorySpace.y * 0.9 && pc.render.y - pc.w / 2 < (this.inventorySpace.y + this.inventorySpace.h) * 1.1) {
                        pc.draw(undefined, undefined, true);
                    } else {
                        pc.render.x = interpolate(pc.render.x, pc.x, 0.00672 * dt)
                        pc.render.y = interpolate(pc.render.y, pc.y, 0.00672 * dt)
                    }

                    if (this.firstPetalContainer === null) {
                        this.firstPetalContainer = pc;
                    }
                    this.lastPetalContainer = pc;
                } else {
                    if (this.firstPetalContainer === null) {
                        this.firstPetalContainer = fpc;
                    }
                    this.lastPetalContainer = fpc;
                }
            }
        }

        if (Object.keys(this.petalContainers).length < 5) {
            this.fillingHorizontal = true;
            for (let j = Object.keys(this.petalContainers).length; j < 5; j++) {
                const typeKey = "filler" + j;
                for (let i = 0; i <= Math.max(5, this.maxRarity); i++) {
                    const rarityKey = i;
                    const pcX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * rarityKey + 3 - this.render.horizontalScroll * (this.totalPetalWidth - this.inventorySpace.h);
                    const pcY = 5 + this.petalContainerSize / 2 + (maxTypeIndex + j - Object.keys(this.petalContainers).length + 1) * (this.petalContainerSize + 12) + 5 + this.inventorySpace.y - this.render.scroll * (this.totalPetalHeight - this.inventorySpace.h);

                    if (this.fillerPetalSlots[typeKey] === undefined) {
                        this.fillerPetalSlots[typeKey] = {};
                    }
                    if (this.fillerPetalSlots[typeKey][rarityKey] === undefined) {
                        this.fillerPetalSlots[typeKey][rarityKey] = { render: { x: pcX, y: pcY } };
                    }
                    const fpc = this.fillerPetalSlots[typeKey][rarityKey];
                    fpc.x = pcX;
                    fpc.y = pcY;
                    fpc.render.x = interpolate(fpc.render.x, fpc.x, 0.00672 * dt);
                    fpc.render.y = interpolate(fpc.render.y, fpc.y, 0.00672 * dt);
                    ctx.fillStyle = '#b17f49';
                    ctx.beginPath();
                    ctx.roundRect(fpc.render.x - this.petalContainerSize / 2, fpc.render.y - this.petalContainerSize / 2, this.petalContainerSize, this.petalContainerSize, 8);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        } else {
            this.fillingHorizontal = false;
        }

        if (this.lastPetalContainer !== null) {
            const petalDimensions = {
                start: this.firstPetalContainer.y - this.petalContainerSize / 2 - 6,
                end: this.lastPetalContainer.y + this.petalContainerSize / 2 + 6
            }
            petalDimensions.length = petalDimensions.end - petalDimensions.start;
            this.totalPetalHeight = petalDimensions.length;
        }

        ctx.restore();

        let needsFilter = false;
        for (let i = 0; i < this.fadingPetalContainers.length; i++) {
            if (this.fadingPetalContainers[i].spawnTime < 0.001) {
                this.fadingPetalContainers[i].toRemove = true;
                needsFilter = true;
            }
            this.fadingPetalContainers[i].draw();
        }
        if (needsFilter === true) {
            this.fadingPetalContainers = this.fadingPetalContainers.filter(p => p.toRemove !== true);
        }
        if (this.fillingHorizontal === false) {
            this.render.scroll = interpolate(this.render.scroll, this.scroll, 0.0070 * dt);
            if (this.render.scroll < -.1) {
                this.render.scroll = -.1;
            } else if (this.render.scroll > 1.1) {
                this.render.scroll = 1.1;
            }

            this.scrollbar.pos = interpolate(this.scrollbar.start, this.scrollbar.end, this.render.scroll);
            this.scrollbar.bottom = this.scrollbar.pos + this.scrollbar.length / 2;
            this.scrollbar.top = this.scrollbar.pos - this.scrollbar.length / 2;

            this.scrollbar.renderTop = interpolate(this.scrollbar.renderTop, this.scrollbar.top, this.draggingScrollBar ? 0.28 : 0.08);
            this.scrollbar.renderBottom = interpolate(this.scrollbar.renderBottom, this.scrollbar.bottom, this.draggingScrollBar ? 0.28 : 0.08);
        }

        if (this.maxRarity >= 5) {
            this.render.horizontalScroll = interpolate(this.render.horizontalScroll, this.horizontalScroll, 0.0070 * dt);

            this.horizontalScrollBar.pos = interpolate(this.horizontalScrollBar.start, this.horizontalScrollBar.end, this.render.horizontalScroll);
            this.horizontalScrollBar.right = this.horizontalScrollBar.pos + this.horizontalScrollBar.length / 2;
            this.horizontalScrollBar.left = this.horizontalScrollBar.pos - this.horizontalScrollBar.length / 2;

            this.horizontalScrollBar.renderRight = interpolate(this.horizontalScrollBar.renderRight, this.horizontalScrollBar.right, this.draggingHorizontalScrollBar ? 0.28 : 0.08);
            this.horizontalScrollBar.renderLeft = interpolate(this.horizontalScrollBar.renderLeft, this.horizontalScrollBar.left, this.draggingHorizontalScrollBar ? 0.28 : 0.08);
        }

        if (this.scroll < 0) {
            this.scroll = 0;
        } else if (this.scroll > 1) {
            this.scroll = 1;
        }

        ctx.strokeStyle = this.getMainStroke();
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.w - 16, (this.scrollbar.renderTop));
        ctx.lineTo(this.w - 16, (this.scrollbar.renderBottom));
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.horizontalScrollBar.renderRight, this.h - 16);
        ctx.lineTo(this.horizontalScrollBar.renderLeft, this.h - 16);
        ctx.stroke();
        ctx.closePath();

        if (this.menuActive === true && translation === 0) {
            if (mouse.canvasX > 130 + this.w - 7.5 - 30 - 3 && mouse.canvasY > canvas.h - this.h - 20 + 7.5 + 3 && mouse.canvasX < 130 + this.w - 7.5 - 3 && mouse.canvasY < canvas.h - this.h - 20 + 7.5 + 30 + 3) {
                ctx.fillStyle = "#c16666";
                setCursor('pointer');
                this.hoveringOverX = true;
            } else {
                this.hoveringOverX = false;
                ctx.fillStyle = '#c1565e';
            }
        } else {
            ctx.fillStyle = '#c1565e';
            this.hoveringOverX = false;
        }
        ctx.translate(-3, 3);
        ctx.strokeStyle = '#90464b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(this.w - 7.5 - 30, 7.5, 30, 30, 6);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 4.75;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#cccccc';
        ctx.beginPath();
        ctx.moveTo(this.w - 30, 30);
        ctx.lineTo(this.w - 7.5 * 2, 7.5 + 7.5);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(this.w - 7.5 * 2, 30);
        ctx.lineTo(this.w - 30, 7.5 + 7.5);
        ctx.stroke();
        ctx.closePath();
        ctx.translate(3, -3);

        const mouseX = mouse.x * canvas.w / window.innerWidth;
        const mouseY = mouse.y * canvas.h / window.innerHeight;

        if (mouseX > 130 && mouseX < 130 + this.w - 20 && mouseY > canvas.h - this.h - 20 && mouseY < canvas.h - 20) {
            ctx.lastTransform5 = ctx.getTransform();
            for (let typeKey in this.petalContainers) {
                for (let i = 0; i <= this.maxRarity; i++) {
                    if (this.petalContainers[typeKey] === undefined) continue;
                    const rarityKey = i;
                    const pc = this.petalContainers[typeKey][rarityKey];
                    if (pc === undefined) continue;

                    if (pc.render.x + pc.w / 2 > this.inventorySpace.x * 0.9 && pc.render.x - pc.w / 2 < (this.inventorySpace.x + this.inventorySpace.w) * 1.1 && pc.render.y + pc.w / 2 > this.inventorySpace.y * 0.9 && pc.render.y - pc.w / 2 < (this.inventorySpace.y + this.inventorySpace.h) * 1.1) {
                        if (mouseInBox({ x: mouseX, y: mouseY }, { x: pc.render.x - pc.w / 2 + 130, y: pc.render.y - pc.h / 2 + canvas.h - this.h - 20, w: pc.w, h: pc.h }) === true) {
                            pc.isHovered = true;
                        }
                        pc.drawStatsBox();
                    }
                }
            }

            if (this.craftingAnimationState === "display") {
                const pc = this.displayPetalContainer;
                if (mouseInBox({ x: mouseX, y: mouseY }, { x: pc.render.x - pc.w / 2 + 130, y: pc.render.y - pc.h / 2 + canvas.h - this.h - 20, w: pc.w, h: pc.h }) === true) {
                    pc.isHovered = true;
                }
                pc.drawStatsBox();
            } else {
                for (let i = 0; i < this.craftingPetalSlots.length; i++) {
                    if (this.craftingPetalContainers[i] !== undefined) {
                        const pc = this.craftingPetalContainers[i];
                        if (mouseInBox({ x: mouseX, y: mouseY }, { x: pc.render.x - pc.w / 2 + 130, y: pc.render.y - pc.h / 2 + canvas.h - this.h - 20, w: pc.w, h: pc.h }) === true) {
                            pc.isHovered = true;
                        }
                        pc.drawStatsBox();
                    }
                }
            }
            ctx.setTransform(ctx.lastTransform5);
            delete ctx.lastTransform5;
        }

        ctx.translate(-130, -(canvas.h - this.h - 20));

        if (translation !== 0) {
            ctx.translate(0, -translation);
        }
        ctx.globalAlpha = 1;
    }

    renderHpBar = function({x,y,radius,hp,maxHp,beforeStreakHp,givenAlpha,flowerName,flowerUsername,shield,team},entity={fadeState: undefined, fadeTime: 0, lastHp: hp}, rarity, isBoss){
        if(entity.fadeState === undefined){
            if(Math.ceil(entity.hp) === maxHp && !shield){
                entity.fadeState = 'invisible';
                entity.fadeTime = -220;
            } else {
                entity.fadeTime = time;
                entity.fadeState = 'fadeIn';
            }
        }
        if(entity.lastHp === undefined){
            entity.lastHp = entity.hp;
        }
        if(entity.lastShield === undefined){
            entity.lastShield = entity.shield;
        }
    
        let fadeAlphaMult = 1;

        if(entity.dead !== true){
            if(Math.ceil(entity.lastHp) < maxHp && Math.ceil(entity.hp) === maxHp && entity.shield == 0){
                entity.fadeTime = time;
                entity.fadeState = 'fadeOut';
            } else if((Math.ceil(entity.lastHp) === maxHp && Math.ceil(entity.hp) < maxHp) || (entity.shield != 0 && entity.lastShield == 0)){
                entity.fadeTime = time;
                entity.fadeState = 'fadeIn';
            }
        }
        entity.lastShield = entity.shield;
        entity.lastHp = entity.hp;
    
        toResetFadeState = false;
        if (givenAlpha){
            if (givenAlpha > 0){
                toResetFadeState = entity.fadeState;
                entity.fadeState = "visible";
            }
        }
        if(entity.fadeState === 'fadeOut'){
            fadeAlphaMult = 1 - (time - entity.fadeTime) / 180;
            if(fadeAlphaMult < 0){
                fadeAlphaMult = 0;
                entity.fadeState = 'invisible';
            }
        } else if(entity.fadeState === 'fadeIn'){
            fadeAlphaMult = (time - entity.fadeTime) / 180;
            if(fadeAlphaMult > 1){
                fadeAlphaMult = 1;
                entity.fadeState = 'visible';
            }
        } else if(entity.fadeState === 'invisible'){
            return;
        }
    
        if(entity.dead === true)fadeAlphaMult *= ((10 - entity.deadAnimationTimer) / 166) ** 3;

        if (givenAlpha){
            fadeAlphaMult = givenAlpha;
        }
        const barDimensions = {
            w: (radius/25)**1.2*25*3.2+.33,
            h: (radius/25)**1.2*25*0.39+.33,
            borderRadius: (radius/25)**1.2*25*0.25,
            innerPadding: (radius/25)**1.05*1.8-.1
        }
        ctx.globalAlpha = fadeAlphaMult;
        hp = Math.max(hp, 0);
        beforeStreakHp = Math.max(beforeStreakHp, 0);

        if(rarity){
            let rarName = Colors.rarities[rarity].name;
            if(isBoss){
                ctx.fillStyle = `hsl(${(time/10) % 360}, 50%, 40%)`;
                rarName = 'Boss';
            } else {
                ctx.fillStyle = Colors.rarities[rarity].color;
            };
            ctx.beginPath();
            ctx.roundRect(x - barDimensions.w/2 - barDimensions.innerPadding, y + radius*1.775 - barDimensions.innerPadding, (barDimensions.w - barDimensions.borderRadius * 1.5) + barDimensions.borderRadius * 1.5 + barDimensions.innerPadding * 2, barDimensions.h + barDimensions.innerPadding * 2, barDimensions.borderRadius * barDimensions.h / (barDimensions.h - barDimensions.innerPadding * 2));
            ctx.fill();
            ctx.closePath();

            ctx.font = '900 36px Ubuntu';
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.strokeText(rarName, x - barDimensions.w/2 + barDimensions.w / 2, y + radius*2.5 + barDimensions.innerPadding);
            ctx.fillText(rarName, x - barDimensions.w/2 + barDimensions.w / 2, y + radius*2.5 + barDimensions.innerPadding);
        }

        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.roundRect(x - barDimensions.w/2, y + radius*1.775, barDimensions.w, barDimensions.h, barDimensions.borderRadius);
        ctx.fill();
        ctx.closePath();
    
        if(flowerName !== undefined && entity.id !== window.selfId){
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.25;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = `900 22px Ubuntu`;
                if (window.usernames === true) {
                    ctx.strokeText(flowerName, x, y - radius * 2.75 + barDimensions.h + 2);
                    ctx.fillText(flowerName, x, y - radius * 2.75 + barDimensions.h + 2);
                    ctx.font = `900 10px Ubuntu`;
                    ctx.fillStyle = '#bbbbbb';
                    ctx.strokeText(flowerUsername, x, y - radius * 2 + barDimensions.h + 2);
                    ctx.fillText(flowerUsername, x, y - radius * 2 + barDimensions.h + 2);
            } else {
                    ctx.strokeText(flowerName, x, y - radius * 2.375 + barDimensions.h + 2);
                    ctx.fillText(flowerName, x, y - radius * 2.375 + barDimensions.h + 2);
            }
        }
    
        if(beforeStreakHp < maxHp / 10){
            ctx.globalAlpha = Math.max(0,hp * .95 / (maxHp / 10) + 0.05) * fadeAlphaMult;
        }
        if(beforeStreakHp > 0){
            ctx.fillStyle = '#dd3434'
            ctx.beginPath();
            const paddingMult = 1.4;
            ctx.roundRect(x - barDimensions.w/2 + barDimensions.innerPadding * paddingMult, y + radius*1.775 + barDimensions.innerPadding * paddingMult, (barDimensions.w - barDimensions.borderRadius * 1.5) * Math.min(1,beforeStreakHp / maxHp) + barDimensions.borderRadius * 1.5 - barDimensions.innerPadding * 2 * paddingMult, barDimensions.h - barDimensions.innerPadding * paddingMult * 2, barDimensions.borderRadius * barDimensions.h / (barDimensions.h + barDimensions.innerPadding * 2));
            ctx.fill();
            ctx.closePath();
        }
        
    
        ctx.globalAlpha = fadeAlphaMult;
        if(hp < maxHp / 10){
            ctx.globalAlpha = Math.max(0,hp * .95 / (maxHp / 10) + 0.05) * fadeAlphaMult;
        }
    
        if(hp > 0){
            ctx.fillStyle = '#75dd34'
            if (team == "flower"){
                ctx.fillStyle = "#b5aa31"
            }
            ctx.beginPath();
            
            ctx.roundRect(x - barDimensions.w/2 + barDimensions.innerPadding, y + radius*1.775 + barDimensions.innerPadding, (barDimensions.w - barDimensions.borderRadius * 1.5) * Math.min(1, hp / maxHp) + barDimensions.borderRadius * 1.5 - barDimensions.innerPadding * 2, barDimensions.h - barDimensions.innerPadding * 2, barDimensions.borderRadius * barDimensions.h / (barDimensions.h + barDimensions.innerPadding * 2));
            ctx.fill();
            ctx.closePath();
        }
        if (shield){
            if (shield > maxHp * 0.005){
                ctx.fillStyle = 'white'
                ctx.beginPath();
                
                ctx.roundRect(x - barDimensions.w/2 + barDimensions.innerPadding, y + radius*1.805 + barDimensions.innerPadding, (barDimensions.w - barDimensions.borderRadius * 1.5) * Math.min(1, shield / maxHp) + barDimensions.borderRadius * 1.5 - barDimensions.innerPadding * 2, barDimensions.h - barDimensions.innerPadding * 3, barDimensions.borderRadius * barDimensions.h / (barDimensions.h + barDimensions.innerPadding * 3));
                ctx.fill();
                ctx.closePath();
            }
        }
    
        ctx.globalAlpha = 1;
    
        if(toResetFadeState !== false){
            entity.fadeState = toResetFadeState;
        }
    }

    enemyRenderMapText = function(e) {
        renderHpBar({
            x: 0,
            y: 0,
            radius: e.render.radius * 0.8,
            hp: e.render.hp,
            maxHp: e.maxHp,
            beforeStreakHp: e.render.beforeStreakHp,
            team: e.team
        }, e, e.rarity, e.isBoss);
        if (!window.isEditor === true && window.damageCounter) {
            renderDamageCounter({
                radius: e.render.radius,
                timeAlive: e.ticksSinceLastDamaged,
                totalDamage: e.damageCount,
            })
        }
    }

    inventory.draw = function(alpha = 1) {
        if(this.fadingPetalContainer !== null){
            const temp = {x: this.fadingPetalContainer.render.x, y: this.fadingPetalContainer.render.y};
            this.fadingPetalContainer.render.x = this.fadingPetalContainer.x;
            this.fadingPetalContainer.render.y = this.fadingPetalContainer.y;
            const animationTime = 1 - (time - this.fadingPetalContainer.fadeTime) / 200;
            ctx.globalAlpha = Math.max(0,Math.min(1,animationTime));
            ctx.save();
            ctx.translate(this.fadingPetalContainer.x, this.fadingPetalContainer.y);
            ctx.scale(2 - animationTime, 2 - animationTime);
            ctx.translate(-this.fadingPetalContainer.x, -this.fadingPetalContainer.y);
            this.fadingPetalContainer.draw(alpha);
            ctx.restore();
            this.fadingPetalContainer.render.x = temp.x;
            this.fadingPetalContainer.render.y = temp.y;
            if(time - this.fadingPetalContainer.fadeTime > 200){
                this.fadingPetalContainer = null;
            }
        }

        for(let i = 0; i < this.topPetalSlots.length; i++){
            this.topPetalSlots[i].draw(alpha);
        }
        for(let i = 0; i < this.bottomPetalSlots.length; i++){
            this.bottomPetalSlots[i].draw(alpha);
        }
        for(let key in this.topPetalContainers){
            const tpc = this.topPetalContainers[key];
            let showTimer = false;
            let rarity;
            if (tpc.type == 'Egg' || tpc.type == 'Plastic Egg') {
                if (petalReloadData[key] && Math.abs(petalReloadData[key].reload - 1) >= 1e-12) {
                    tpc.respawnTimer = tpc.petalStats.hatchTime + tpc.petalStats.reload * petalReloadData[key].reload;
                    showTimer = true;
                } else if (tpc.hasOwnProperty('respawnTimer')) {
                    tpc.respawnTimer -= dt / 1000;
                    showTimer = true;
                    if (tpc.respawnTimer <= 0) {
                        delete tpc.respawnTimer;
                        showTimer = false;
                    };
                };
                rarity = tpc.petalStats.spawnRarity;
            } else if (tpc.type == 'Stick') {
                if (petalReloadData[key]) {
                    tpc.respawnTimer = [];
                    tpc.respawnTimer.push(tpc.petalStats.spawnSystem[1] + tpc.petalStats.reload * petalReloadData[key].reload);
                    tpc.respawnTimer.push(tpc.petalStats.spawnSystem[1] * 2 + tpc.petalStats.reload * petalReloadData[key].reload);
                    showTimer = true;
                } else if (tpc.hasOwnProperty('respawnTimer')) {
                    tpc.respawnTimer[0] -= dt / 1000;
                    tpc.respawnTimer[1] -= dt / 1000;
                    showTimer = true;
                    if (tpc.respawnTimer[1] <= 0) {
                        delete tpc.respawnTimer;
                        showTimer = false;
                    } else if (tpc.respawnTimer[0] <= 0) {
                        tpc.respawnTimer[0] = 0;
                    };
                };
                rarity = tpc.petalStats.spawnSystem[0];
            };
            tpc.draw(true, key);
            if (showTimer) {
                ctx.save();
                ctx.lineWidth = 4.5;
                ctx.translate(tpc.x, tpc.y - tpc.h * 1.15);
                ctx.scale(tpc.w / 50, tpc.h / 50);

                if (Colors.rarities[rarity].fancy !== undefined){
                    const gradientFill = ctx.createLinearGradient(-30, -30, 30, 30);
                    createFancyGradient(gradientFill, rarity);
                    ctx.fillStyle = gradientFill;
                    ctx.strokeStyle = Colors.rarities[rarity].fancy.border;
                } else {
                    ctx.fillStyle = Colors.rarities[rarity].color;
                    ctx.strokeStyle = Colors.rarities[rarity].border;
                }
        
                ctx.beginPath();
                ctx.roundRect(-25, -25, 50, 50, .25);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.restore();

                ctx.font = '900 24px Ubuntu';
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'white';
                let timer = tpc.type == 'Stick' ? (tpc.respawnTimer[0] == 0 ? tpc.respawnTimer[1] : tpc.respawnTimer[0]) : tpc.respawnTimer;
                ctx.strokeText(Math.round(timer * 100) / 100 + 's', tpc.x, tpc.y - tpc.h * 1.15);
                ctx.fillText(Math.round(timer * 100) / 100 + 's', tpc.x, tpc.y - tpc.h * 1.15);
            };
        }
        for(let key in this.bottomPetalContainers){
            this.bottomPetalContainers[key].draw();
        }

        if(this === menuInventory){
            const mouseX = mouse.x * canvas.w / window.innerWidth;
            const mouseY = mouse.y * canvas.h / window.innerHeight;
            const offsetMouseY = mouseY - this.translateY;
            ctx.lastTransform8 = ctx.getTransform();
            for(let key in this.topPetalContainers){
                const pc = this.topPetalContainers[key];

                if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && offsetMouseY > pc.y - pc.h/2 && offsetMouseY < pc.y + pc.h/2){
                    pc.isHovered = true;
                }
                pc.drawStatsBox(true);
            }

            for(let key in this.bottomPetalContainers){
                const pc = this.bottomPetalContainers[key];

                if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && offsetMouseY > pc.y - pc.h/2 && offsetMouseY < pc.y + pc.h/2){
                    pc.isHovered = true;
                }
                pc.drawStatsBox(true);
            }
            ctx.setTransform(ctx.lastTransform8);
            delete ctx.lastTransform8;
        }
    }
})();
