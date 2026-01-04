// ==UserScript==
// @name         TF Chocolate Skin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  press the use webgl option on jstris to use / Skin by Lythine
// @author       freyhoe
// @match        https://jstris.jezevec10.com/*
// @icon         https://www.google.com/s2/favicons?domain=jezevec10.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432099/TF%20Chocolate%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/432099/TF%20Chocolate%20Skin.meta.js
// ==/UserScript==
const skinURL = "https://i.imgur.com/Xlv6Hvy.png"
const skinSize = 24
const removeDimple = true

const garbageSettings = {
    full:0,
    blocky:1,
    cut:2,
}
const solidGarbageSettings = {
    full:0,
    cut:1,
}

const garbageSetting = garbageSettings.full
const solidGarbageSetting = solidGarbageSettings.full


WebGLView['prototype']['initGLContext'] = function(cmain) {
    cmain['gl'] = WebGLUtils['getWebGLcontext'](cmain['elem']);
    cmain['program'] = WebGLUtils['createProgram'](cmain['gl'], this['shaders']);
    cmain['m4'] = new Float32Array(16);
    var gl = cmain['gl'],
        cprogram = cmain['program'];
    gl['useProgram'](cprogram);
    cmain['positionLocation'] = gl['getAttribLocation'](cprogram, 'a_position');
    cmain['texcoordLocation'] = gl['getAttribLocation'](cprogram, 'a_texcoord');
    cmain['matrixLocation'] = gl['getUniformLocation'](cprogram, 'u_matrix');
    cmain['textureMatrixLocation'] = gl['getUniformLocation'](cprogram, 'u_textureMatrix');
    cmain['globalAlpha'] = gl['getUniformLocation'](cprogram, 'globalAlpha');
    gl['uniform1f'](cmain['globalAlpha'], 1);
    cmain['positionBuffer'] = gl['createBuffer']();
    gl['bindBuffer'](gl.ARRAY_BUFFER, cmain['positionBuffer']);
    var push1 = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl['bufferData'](gl.ARRAY_BUFFER, new Float32Array(push1), gl.STATIC_DRAW);
    cmain['texcoordBuffer'] = gl['createBuffer']();
    gl['bindBuffer'](gl.ARRAY_BUFFER, cmain['texcoordBuffer']);
    var push2 = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl['bufferData'](gl.ARRAY_BUFFER, new Float32Array(push2), gl.STATIC_DRAW);
    cmain['textureInfos'] = [];
    cmain['boundBuffers'] = false;
    cmain['boundTexture'] = null;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this['initEmptyTexture'](cmain, 0);
    this['initEmptyTexture'](cmain, 1);
    this['initRedbarTexture'](cmain, 2)
};
Game['prototype']['drawGhostAndCurrent'] = function() {
    let blockset = this['blockSets'][this['activeBlock']['set']],
        blocks = (blockset['scale'] === 1) ? blockset['blocks'][this['activeBlock']['id']]['blocks'][this['activeBlock']['rot']] : blockset['previewAs']['blocks'][this['activeBlock']['id']]['blocks'][this['activeBlock']['rot']],
        blocks_length = blocks['length'];
    this['drawScale'] = blockset['scale'];
    if (this['ghostEnabled'] && !this['gameEnded']) {
        for (let y = 0; y < blocks_length; y++) {
            for (let x = 0; x < blocks_length; x++) {
                if (blocks[y][x] > 0) {
                    let connect_value = 0
                    let checks = {N:false,S:false,E:false,W:false}
                    let row = y
                    let col = x
                    if(row!=0 && blocks [row-1][col]>0){connect_value+=1;checks.N=true}
                    if(row!=blocks.length-1 && blocks[row+1][col]>0){connect_value+=2;checks.S=true}
                    if(blocks[row][col-1]>0){connect_value+=4;checks.W=true;}
                    if(blocks[row][col+1]>0){connect_value+=8;checks.E=true;}
                    let corners = {a:false, b:false, c:false, d:false}

                    if(checks.N&&checks.E&&row!=0&&blocks[row-1][col+1]>0)corners.a=true
                    if(checks.S&&checks.E&&blocks[row+1][col+1]>0)corners.b=true
                    if(checks.S&&checks.W&&blocks[row+1][col-1]>0)corners.c=true
                    if(checks.N&&checks.W&&row!=0&&blocks[row-1][col-1]>0)corners.d=true
                    this['v']['ai_drawGhostBlock'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], connect_value);
                    if (this['activeBlock']['item'] && blocks[y][x] === this['activeBlock']['item']) {
                        this['v']['drawBrickOverlay'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], true)
                    }
                    let overlay = 0
                    if(corners.a)overlay = 16
                    if(corners.b)overlay = 17
                    if(corners.c)overlay = 18
                    if(corners.d)overlay = 19
                    if(overlay>0 && removeDimple)this['v']['ai_drawGhostBlock'](this['ghostPiece']['pos']['x'] + x * this['drawScale'], this['ghostPiece']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], overlay)
                }
            }
        }
    };
    if (!this['gameEnded']) {
        for (let y = 0; y < blocks_length; y++) {
            for (let x = 0; x < blocks_length; x++) {
                if (blocks[y][x] > 0) {
                    let connect_value = 0
                    let checks = {N:false,S:false,E:false,W:false}
                    let row = y
                    let col = x
                    if(row!=0 && blocks [row-1][col]>0){connect_value+=1;checks.N=true}
                    if(row!=blocks.length-1 && blocks[row+1][col]>0){connect_value+=2;checks.S=true}
                    if(blocks[row][col-1]>0){connect_value+=4;checks.W=true;}
                    if(blocks[row][col+1]>0){connect_value+=8;checks.E=true;}
                    let corners = {a:false, b:false, c:false, d:false}

                    if(checks.N&&checks.E&&row!=0&&blocks[row-1][col+1]>0)corners.a=true
                    if(checks.S&&checks.E&&blocks[row+1][col+1]>0)corners.b=true
                    if(checks.S&&checks.W&&blocks[row+1][col-1]>0)corners.c=true
                    if(checks.N&&checks.W&&row!=0&&blocks[row-1][col-1]>0)corners.d=true
                    this['v']['ai_drawBlock'](this['activeBlock']['pos']['x'] + x * this['drawScale'], this['activeBlock']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], connect_value, 0);
                    if (this['activeBlock']['item'] && blocks[y][x] === this['activeBlock']['item']) {
                        this['v']['drawBrickOverlay'](this['activeBlock']['pos']['x'] + x * this['drawScale'], this['activeBlock']['pos']['y'] + y * this['drawScale'], false)
                    }
                    let overlay = 0
                    if(corners.a)overlay = 16
                    if(corners.b)overlay = 17
                    if(corners.c)overlay = 18
                    if(corners.d)overlay = 19
                    if(overlay>0 && removeDimple)this['v']['ai_drawBlock'](this['activeBlock']['pos']['x'] + x * this['drawScale'], this['activeBlock']['pos']['y'] + y * this['drawScale'], blockset['blocks'][this['activeBlock']['id']]['color'], overlay, 0);             }
            }
        }
    };
    this['drawScale'] = 1
};
WebGLView['prototype']['redrawMatrix'] = function() {
    this['clearMainCanvas']();
    if (this['g']['isInvisibleSkin']) {
        return
    };
    let queue = []
    for (var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
            let block_value = this['g']['matrix'][row][col]
            if(!block_value)continue
            if(typeof(block_value)=="number"){
                let connect_value = 0
                let checks = {N:false,S:false,E:false,W:false}

                if(row==0){if(this.g.deadline[col]==block_value){connect_value+=1;checks.N=true}}
                else if(this.g.matrix[row-1][col]==block_value){connect_value+=1;checks.N=true}
                if(row!=19 && this.g.matrix[row+1][col]==block_value){connect_value+=2;checks.S=true}
                if(this.g.matrix[row][col-1]==block_value){connect_value+=4;checks.W=true;}
                if(this.g.matrix[row][col+1]==block_value){connect_value+=8;checks.E=true;}
                let corners = {a:false, b:false, c:false, d:false}

                if(checks.N&&checks.E){if(row==0){if(this.g.deadline[col+1]==block_value)corners.a=true}else if(this.g.matrix[row-1][col+1]==block_value)corners.a=true}
                if(checks.S&&checks.E&&this.g.matrix[row+1][col+1]==block_value)corners.b=true
                if(checks.S&&checks.W&&this.g.matrix[row+1][col-1]==block_value)corners.c=true
                if(checks.N&&checks.W){if(row==0){if(this.g.deadline[col-1]==block_value)corners.d=true}else if(this.g.matrix[row-1][col-1]==block_value)corners.d = true}
                let push = ""
                if(connect_value < 10){
                    push = "0" + connect_value.toString()
                }
                else push = connect_value.toString()
                let push2 = 0
                if(corners.a)push2+=1
                if(corners.b)push2+=2
                if(corners.c)push2+=4
                if(corners.d)push2+=8
                if(!((garbageSetting == garbageSettings.full && block_value==8) || (solidGarbageSetting == solidGarbageSettings.full && block_value==9)))queue.push({row:row, col:col, num: block_value.toString()+ push + push2.toString()})
                this['ai_drawBlock'](col, row, block_value, connect_value, this.MAIN)
                if(!removeDimple)continue
                if(corners.a)this['ai_drawBlock'](col, row, block_value, 16, this.MAIN)
                if(corners.b)this['ai_drawBlock'](col, row, block_value, 17, this.MAIN)
                if(corners.c)this['ai_drawBlock'](col, row, block_value, 18, this.MAIN)
                if(corners.d)this['ai_drawBlock'](col, row, block_value, 19, this.MAIN)
            }
            else{
                block_value = this['g']['matrix'][row][col]
                let full = block_value.toString()
                this['ai_drawBlock'](col, row, Number(full.substring(0,1)), Number(full.substring(1,3)), this.MAIN)
                if(!removeDimple)continue
                let cvalue = Number(full.substring(3))
                if(cvalue&1)this['ai_drawBlock'](col, row, Number(full.substring(0,1)), 16, this.MAIN)
                if(cvalue&2)this['ai_drawBlock'](col, row, Number(full.substring(0,1)), 17, this.MAIN)
                if(cvalue&4)this['ai_drawBlock'](col, row, Number(full.substring(0,1)), 18, this.MAIN)
                if(cvalue&8)this['ai_drawBlock'](col, row, Number(full.substring(0,1)), 19, this.MAIN)
            }
        }
    }
    for(let rep of queue){
        this.g.matrix[rep.row][rep.col] = rep.num
    }
};
WebGLView['prototype']['ai_drawBlock'] = function(pos_x, pos_y, block_value, connect_value, main) {
    if (block_value) {
        let scale = this['g']['drawScale'] * this['g']['block_size'];
        let cmain = this['ctxs'][main],
            texture = cmain['textureInfos'][0];
        this['drawImage'](cmain, texture['texture'],texture['width'], texture['height'],this['g']['coffset'][block_value] * skinSize, connect_value * skinSize, skinSize, skinSize, pos_x * this['g']['block_size'],pos_y * this['g']['block_size'],scale, scale)
    }
};
WebGLView['prototype']['ai_drawGhostBlock'] = function(pos_x, pos_y, block_value, connect_value) {
    var cmain = this['ctxs'][0];
    if (this['g']['ghostSkinId'] === 0) {
        cmain['gl']['uniform1f'](cmain['globalAlpha'], 0.5);
        this['ai_drawBlock'](pos_x, pos_y, block_value, connect_value, 0);
        cmain['gl']['uniform1f'](cmain['globalAlpha'], 1)
    } else {
        var scale = this['g']['drawScale'] * this['g']['block_size'];
        var texture = cmain['textureInfos'][1];
        this['drawImage'](cmain, texture['texture'],texture['width'], texture['height'],(this['g']['coffset'][block_value]-2) * skinSize, connect_value * skinSize, skinSize, skinSize, pos_x * this['g']['block_size'],pos_y * this['g']['block_size'],scale, scale)
        //this['drawImage'](cmain, texture['texture'], texture['width'], texture['height'], (this['g']['coffset'][block_value] - 2) * skinSize, connect_value * skinSize, skinSize, skinSize, pos_x * this['g']['block_size'], pos_y * this['g']['block_size'], scale, scale)
    }
};
GameCore['prototype']['updateQueueBox'] = function() {
    if (this['ISGAME'] && this['redrawBlocked']) {
        return
    } else {
        if (!this['ISGAME'] && (this['v']['redrawBlocked'] || !this['v']['QueueHoldEnabled'])) {
            return
        }
    };
    this['v']['clearQueueCanvas']();
    let plug = 0;
    for (var count = 0; count < this['R']['showPreviews']; count++) {
        if (count >= this['queue']['length']) {
            if (this['pmode'] != 9) {
                break
            };
            if (this['ModeManager']['repeatQueue']) {
                this['ModeManager']['addStaticQueueToQueue']()
            } else {
                break
            }
        };
        var currPiece = this['queue'][count];
        var currSet = this['blockSets'][currPiece['set']]['previewAs'],
            blocks = currSet['blocks'][currPiece['id']]['blocks'][0],
            currColor = currSet['blocks'][currPiece['id']]['color'],
            currWeird = (!currSet['equidist']) ? currSet['blocks'][currPiece['id']]['yp'] : [0, 3],
            blocks_length = blocks['length'],
            something = (currSet['blocks'][currPiece['id']]['xp']) ? currSet['blocks'][currPiece['id']]['xp'] : [0, blocks_length - 1];
        for (var y = currWeird[0]; y <= currWeird[1]; y++) {
            for (var x = something[0]; x <= something[1]; x++) {
                if (blocks[y][x] > 0) {
                    let connect_value = 0
                    let checks = {N:false,S:false,E:false,W:false}
                    let row = y
                    let col = x
                    if(row!=0 && blocks [row-1][col]>0){connect_value+=1;checks.N=true}
                    if(row!=blocks.length-1 && blocks[row+1][col]>0){connect_value+=2;checks.S=true}
                    if(blocks[row][col-1]>0){connect_value+=4;checks.W=true;}
                    if(blocks[row][col+1]>0){connect_value+=8;checks.E=true;}
                    let corners = {a:false, b:false, c:false, d:false}

                    if(checks.N&&checks.E&&row!=0&&blocks[row-1][col+1]>0)corners.a=true
                    if(checks.S&&checks.E&&blocks[row+1][col+1]>0)corners.b=true
                    if(checks.S&&checks.W&&blocks[row+1][col-1]>0)corners.c=true
                    if(checks.N&&checks.W&&row!=0&&blocks[row-1][col-1]>0)corners.d=true

                    this['v']['ai_drawBlock'](x - something[0], y - currWeird[0] + plug, currColor, connect_value, this['v'].QUEUE);
                    if (currPiece['item'] && blocks[y][x] === currPiece['item']) {
                        this['v']['drawBrickOverlayOnCanvas'](x - something[0], y - currWeird[0] + plug, this['v'].QUEUE)
                    }
                    let overlay = 0
                    if(corners.a)overlay = 16
                    if(corners.b)overlay = 17
                    if(corners.c)overlay = 18
                    if(corners.d)overlay = 19
                    if(overlay > 0 && removeDimple)this['v']['ai_drawBlock'](x - something[0], y - currWeird[0] + plug, currColor, overlay, this['v'].QUEUE);
                }
            }
        };
        if (currSet['equidist']) {
            plug += 3
        } else {
            plug += currWeird[1] - currWeird[0] + 2
        }
    }
};
GameCore['prototype']['redrawHoldBox'] = function() {
    if (this['ISGAME'] && this['redrawBlocked']) {
        return
    };
    if (!this['ISGAME'] && (this['v']['redrawBlocked'] || !this['v']['QueueHoldEnabled'])) {
        return
    };
    this['v']['clearHoldCanvas']();
    if (this['blockInHold'] !== null) {
        var currSet = this['blockSets'][this['blockInHold']['set']]['previewAs'],
            blocks = currSet['blocks'][this['blockInHold']['id']]['blocks'][0],
            currColor = currSet['blocks'][this['blockInHold']['id']]['color'],
            currWeird = (!currSet['equidist']) ? currSet['blocks'][this['blockInHold']['id']]['yp'] : [0, 3],
            blocks_length = blocks['length'],
            something = (currSet['blocks'][this['blockInHold']['id']]['xp']) ? currSet['blocks'][this['blockInHold']['id']]['xp'] : [0, blocks_length - 1];
        for (var y = currWeird[0]; y <= currWeird[1]; y++) {
            for (var x = something[0]; x <= something[1]; x++) {
                if (blocks[y][x] > 0) {
                    let connect_value = 0
                    let checks = {N:false,S:false,E:false,W:false}
                    let row = y
                    let col = x
                    if(row!=0 && blocks [row-1][col]>0){connect_value+=1;checks.N=true}
                    if(row!=blocks.length-1 && blocks[row+1][col]>0){connect_value+=2;checks.S=true}
                    if(blocks[row][col-1]>0){connect_value+=4;checks.W=true;}
                    if(blocks[row][col+1]>0){connect_value+=8;checks.E=true;}
                    let corners = {a:false, b:false, c:false, d:false}

                    if(checks.N&&checks.E&&row!=0&&blocks[row-1][col+1]>0)corners.a=true
                    if(checks.S&&checks.E&&blocks[row+1][col+1]>0)corners.b=true
                    if(checks.S&&checks.W&&blocks[row+1][col-1]>0)corners.c=true
                    if(checks.N&&checks.W&&row!=0&&blocks[row-1][col-1]>0)corners.d=true
                    this['v']['ai_drawBlock'](x - something[0], y - currWeird[0], currColor, connect_value, this['v'].HOLD);
                    if (this['blockInHold']['item'] && blocks[y][x] === this['blockInHold']['item']) {
                        this['v']['drawBrickOverlayOnCanvas'](x - something[0], y - currWeird[0], this['v'].HOLD)
                    }
                    let overlay = 0
                    if(corners.a)overlay = 16
                    if(corners.b)overlay = 17
                    if(corners.c)overlay = 18
                    if(corners.d)overlay = 19
                    if(overlay > 0&& removeDimple)this['v']['ai_drawBlock'](x - something[0], y - currWeird[0], currColor, overlay, this['v'].HOLD);
                }
            }
        }
    }
};
Game['prototype']['checkLineClears'] = function(time) {
    let x_amount_cleared_lines = 0,
        x_bottom_clear_height = -1,
        x_amount_blocks_line = 0,
        x_flags = 0,
        x_has_item = false,
        x_sum_blocks_matrix = 0, //not accurate
        x_garbage_height = 0,
        x_lineclear_height = [],
        x_original_matrix = null, //for lineclear animation
        x_block = this['blockSets'][this['activeBlock']['set']]['blocks'][this['activeBlock']['id']],
        x_attack_name = '';
    this['wasBack2Back'] = this['isBack2Back'];
    this['spinMiniPossible'] = false;

/*
pmode checks:
1: sprint
3: cheese
7: 20tsd
8: pcmode
9: custom
*/


    if (!this['ISGAME'] && this['pmode'] === 3) {
        x_garbage_height = this['countGarbageHeight']()
    };
    if (!this['R']['clearLines']) {
        this['comboCounter'] = -1;
        return
    };
    if (this['spinPossible']) {
        if (x_block['id'] === 2 || x_block['id'] === 202) {
            this['checkTSpin'](x_block['id'])
        } else {
            if (this['R']['allSpin'] === 2) { //4 point detection
                this['spinPossible'] = false;
                this['checkAllSpin'](x_block['id'])
            } else {
                if (this['R']['allSpin'] !== 1) {
                    this['spinPossible'] = false
                }
            }
        }
    };

    //hotfix
    for (let width = 0; width < 10; ++width) {
        if (this['deadline'][width] !== 0) {
            ++x_amount_blocks_line
        } else {
            if (x_amount_blocks_line > 0) {
                break
            }
        }
    };


    if (x_amount_blocks_line === 10) {
        this['deadline'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        ++x_amount_cleared_lines
    } else {
        x_sum_blocks_matrix += x_amount_blocks_line
    };
    for (var height = 0; height < 20; height++) {
        x_amount_blocks_line = 0;
        x_flags = 0;
        for (let width = 0; width < 10; width++) {
            let brick_id = this['matrix'][height][width];
            if(typeof(brick_id)=="string")brick_id= Number(brick_id.substring(0,1))
            if (brick_id === 9) { //unclearable brick
                break
            } else {
                if (brick_id !== 0) {
                    x_amount_blocks_line++;
                    x_flags |= brick_id
                } else {
                    if ((x_sum_blocks_matrix + x_amount_blocks_line) > 0) {
                        break
                    }
                }
            }
        };
        if (x_amount_blocks_line === 10) {
            let row = height
            if(row==0){
                for(let i in this.deadline){
                    if(typeof(this.deadline[i])=="string"){
                        let push = this.deadline[i]
                        let part1 = Number(push.substring(0,1))
                        let part2 = Number(push.substring(1,3))
                        let part3 = Number(push.substring(3))
                        if(part2&2)part2-=2
                        if(part3&2)part3-=2
                        if(part3&4)part3-=4
                        if(part2/10<1)part2 = "0"+part2.toString()
                        this.deadline[i] = part1.toString() + part2.toString() + part3.toString()
                    }
                }
            }
            else{
                for(let i in this.matrix[row-1]){
                    let push = this.matrix[row-1][i]
                    if(typeof(push)=="string"){
                        let part1 = Number(push.substring(0,1))
                        let part2 = Number(push.substring(1,3))
                        let part3 = Number(push.substring(3))
                        if(part2&2)part2-=2
                        if(part3&2)part3-=2
                        if(part3&4)part3-=4
                        if(part2/10<1)part2 = "0"+part2.toString()
                        this.matrix[row-1][i] = part1.toString() + part2.toString() + part3.toString()
                    }
                }
            }
            if(row!=19){
                for(let i in this.matrix[row+1]){
                    let push = this.matrix[row+1][i]
                    if(typeof(push)=="string"){
                        let part1 = Number(push.substring(0,1))
                        let part2 = Number(push.substring(1,3))
                        let part3 = Number(push.substring(3))
                        if(part2&1)part2-=1
                        if(part3&1)part3-=1
                        if(part3&8)part3-=8
                        if(part2/10<1)part2 = "0"+part2.toString()
                        this.matrix[row+1][i] = part1.toString() + part2.toString() + part3.toString()
                    }
                }
            }
            if (this['R']['clearDelay']) {
                if (x_original_matrix === null) { //for
                    x_original_matrix = copyMatrix(this['matrix']) //for
                };
                x_lineclear_height['push'](height)
            };
            if (this['matrix'][height]['indexOf'](8) >= 0) {
                this['gamedata']['garbageCleared']++
            };
            for (var i = height; i > 0; i--) {
                this['matrix'][i] = this['matrix'][i - 1]
            };
            this['matrix'][0] = this['deadline']['slice'](0);
            this['deadline'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            x_amount_blocks_line = 0;
            x_amount_cleared_lines++;
            x_bottom_clear_height = height;
            //last line of downstack map cleared
            if (this['ISGAME'] && this['isPmode'](false) === 6 && this['MapManager']['mapData']['finish'] === this['MapManager']['FINISH_STANDARD']) {
                this['MapManager']['lineCleared'](height)
            };
            if (x_flags & 16) {
                x_has_item = true
            }
        };
        x_sum_blocks_matrix += x_amount_blocks_line
    };
    if (x_amount_cleared_lines > 0) {
        this['gamedata']['lines'] += x_amount_cleared_lines;
        if (this['GameStats']) {
            this['GameStats']['get']('LINES')['set'](this['gamedata']['lines'])
        };
        var x_amount_attack = 0,
            x_clear_score_type = null;
        switch (x_amount_cleared_lines) {
            case 1:
                this['gamedata']['singles']++;
                x_amount_attack = this['linesAttack'][1];
                if (this['spinPossible']) {
                    if (this['debug']) {
                        x_attack_name = 'T-Spin Single'
                    };
                    x_clear_score_type = this['Scoring']['A']['TSPIN_SINGLE'];
                    x_amount_attack = this['linesAttack'][7];
                    if (this['isBack2Back']) {
                        this['gamedata']['B2B'] += 1;
                        x_amount_attack += this['linesAttack'][10]
                    } else {
                        this['isBack2Back'] = true
                    }
                } else {
                    if (this['spinMiniPossible']) {
                        x_clear_score_type = this['Scoring']['A']['TSPIN_MINI_SINGLE'];
                        if (this['isBack2Back']) {
                            this['gamedata']['B2B'] += 1
                        } else {
                            this['isBack2Back'] = true
                        };
                        x_amount_attack = this['linesAttack'][8];
                        if (this['debug']) {
                            x_attack_name = 'T-Spin Mini Single'
                        }
                    } else {
                        this['isBack2Back'] = false;
                        x_clear_score_type = this['Scoring']['A']['CLEAR1']
                    }
                };
                break;
            case 2:
                this['gamedata']['doubles']++;
                x_amount_attack = this['linesAttack'][2];
                if (this['spinPossible'] || this['spinMiniPossible']) {
                    this['gamedata']['TSD']++;
                    x_amount_attack = this['linesAttack'][5];
                    x_clear_score_type = this['Scoring']['A']['TSPIN_DOUBLE'];
                    if (this['isBack2Back']) {
                        this['gamedata']['B2B'] += 1;
                        x_amount_attack += this['linesAttack'][10]
                    } else {
                        this['isBack2Back'] = true
                    };
                    if (this['debug']) {
                        x_attack_name = 'T-Spin Double'
                    }
                } else {
                    this['isBack2Back'] = false;
                    x_clear_score_type = this['Scoring']['A']['CLEAR2']
                };
                break;
            case 3:
                this['gamedata']['triples']++;
                x_amount_attack = this['linesAttack'][3];
                if ((this['spinPossible'] || this['spinMiniPossible']) && (x_block['id'] === 2 || x_block['id'] === 50)) {
                    x_amount_attack = this['linesAttack'][6];
                    x_clear_score_type = this['Scoring']['A']['TSPIN_TRIPLE'];
                    if (this['isBack2Back']) {
                        this['gamedata']['B2B'] += 1;
                        x_amount_attack += this['linesAttack'][10]
                    } else {
                        this['isBack2Back'] = true
                    };
                    if (this['debug']) {
                        x_attack_name = 'T-Spin Triple'
                    }
                } else {
                    this['isBack2Back'] = false;
                    x_clear_score_type = this['Scoring']['A']['CLEAR3']
                };
                break;
            case 4:
                this['gamedata']['tetrises']++;
                x_clear_score_type = this['Scoring']['A']['CLEAR4'];
                x_amount_attack = this['linesAttack'][4];
                if (this['isBack2Back']) {
                    this['gamedata']['B2B'] += 1;
                    x_amount_attack += this['linesAttack'][10]
                } else {
                    this['isBack2Back'] = true
                };
                if (this['debug']) {
                    x_attack_name = 'Tetris'
                };
                break;
            default:
                this['gamedata']['tetrises']++;
                x_clear_score_type = this['Scoring']['A']['CLEAR5'];
                x_amount_attack = this['linesAttack'][6];
                if (this['isBack2Back']) {
                    this['gamedata']['B2B'] += 1;
                    x_amount_attack += this['linesAttack'][10]
                } else {
                    this['isBack2Back'] = true
                };
                if (this['debug']) {
                    x_attack_name = 'Multitris (' + x_amount_cleared_lines + ')'
                };
                break
        };

        //allspin attacks
        if (this['R']['allSpin'] && this['spinPossible']) {
            if (this['excludedBlocksAS'] && this['excludedBlocksAS']['length'] && this['excludedBlocksAS']['indexOf'](x_block['name']) !== -1) {
                x_amount_attack = 0;
                if (this['debug']) {
                    x_attack_name = 'Ignored ' + x_block['name'] + '-Spin'
                }
            } else {
                if (x_block['id'] !== 2) {
                    x_clear_score_type = 127;
                    if (this['R']['allSpin'] === 1) {
                        if (x_amount_cleared_lines >= 4) {
                            x_amount_attack = this['linesAttack'][6] + 1
                        } else {
                            if (x_amount_cleared_lines === 3) {
                                x_amount_attack = this['linesAttack'][6]
                            } else {
                                if (x_amount_cleared_lines === 2) {
                                    x_amount_attack = this['linesAttack'][5]
                                } else {
                                    x_amount_attack = this['linesAttack'][7]
                                }
                            }
                        }
                    } else {
                        x_amount_attack = this['spinMiniPossible'] ? Math['min'](2, x_amount_cleared_lines) : Math['min'](5, 2 * x_amount_cleared_lines)
                    };
                    if (this['wasBack2Back']) {
                        x_amount_attack += this['linesAttack'][10]
                    };
                    this['isBack2Back'] = true;
                    if (this['debug'] && this['ISGAME']) {
                        x_attack_name = x_block['name'] + '-Spin ' + ((x_amount_cleared_lines <= 4) ? this['multipleNames'][x_amount_cleared_lines - 1] : this['multipleNames'][4]);
                        if (this['spinMiniPossible']) {
                            x_attack_name += ' Mini'
                        };
                        if (this['wasBack2Back']) {
                            x_attack_name = 'B2B ' + x_attack_name
                        }
                    }
                }
            }
        };
        if (x_clear_score_type >= 8 && x_clear_score_type <= 11) {
            this['gamedata']['wasted']--;
            this['gamedata']['tspins']++
        };
        this['score'](x_clear_score_type);
        let x_attack_type = x_clear_score_type;
        if (x_sum_blocks_matrix === 0) {
            this['gamedata']['PCs']++;
            x_amount_attack = this['linesAttack'][9];
            x_attack_type = this['Scoring']['A']['PERFECT_CLEAR'];
            if (this['debug']) {
                x_attack_name = 'Perfect Clear'
            };
            this['score'](x_attack_type);
            if (this['ISGAME'] && this['isPmode'](false) === 6 && this['MapManager']['mapData']['finish'] === this['MapManager']['FINISH_BY_PC']) {
                this['practiceModeCompleted'](time)
            }
        };
        if (this['ISGAME'] && this['isPmode'](false) === 6 && this['MapManager']['mapData']['finish'] === this['MapManager']['FINISH_STANDARD'] && this['MapManager']['mapLines']['length'] === 0) {
            this['practiceModeCompleted'](time)
        };
        this['fourWideFlag'] = this['ISGAME'] && this['Live']['noFourWide'] && ((this['fourWideFlag'] && this['comboCounter'] >= 0) || this['is4W'](x_bottom_clear_height));
        this['comboCounter']++;
        if (this['comboCounter'] > 0) {
            this['score'](this['Scoring']['A'].COMBO, this['comboCounter'])
        };
        if (this['comboCounter'] > this['gamedata']['maxCombo']) {
            this['gamedata']['maxCombo'] = this['comboCounter']
        };
        var x_combo_attack = this['getComboAttack'](this['comboCounter']);
        this['gamedata']['linesSent'] += x_amount_attack + x_combo_attack;
        let x_attack = {
            type: x_attack_type,
            b2b: this['wasBack2Back'],
            cmb: this['comboCounter']
        };
        if (x_amount_attack > 0 || x_combo_attack > 0) {
            if (this['GameStats']) {
                this['GameStats']['get']('ATTACK')['set'](this['gamedata']['linesSent'])
            }
        };
        if (this['ISGAME']) {
            let args = [x_attack_type, x_clear_score_type, (this['wasBack2Back'] && this['isBack2Back']), this['comboCounter']];
            this['playSound'](this['SFXset']['getClearSFX'](...args), 1);
            if (this['VSEenabled']) {
                this['playSound'](this['VSFXset']['getClearSFX'](...args), 2)
            };
            if (this['debug'] && x_attack_name) {
                this['Live']['showInChat']('', x_attack_name)
            }
        };
        if (this['isPmode'](false)) {
            this['gamedata']['attack'] = this['gamedata']['linesSent'];
            if (this['isPmode'](false) === 1) {
                if (this['linesRemaining'] >= x_amount_cleared_lines) {
                    this['linesRemaining'] -= x_amount_cleared_lines
                } else {
                    this['linesRemaining'] = 0
                };
                if (this['ISGAME']) {
                    this['lrem']['textContent'] = this['linesRemaining']
                }
            } else {
                if (this['isPmode'](false) === 3) {
                    let x_new_cheese_height = this['countGarbageHeight']();
                    if (this['ISGAME']) {
                        if (this['cheeseLevel'] > x_new_cheese_height) {
                            var diff = this['cheeseLevel'] - x_new_cheese_height;
                            this['cheeseLevel'] = x_new_cheese_height;
                            this['linesRemaining'] -= diff;
                            if (this['linesRemaining'] > this['cheeseLevel'] && this['cheeseLevel'] < this['minCheeseHeight']) {
                                this['addGarbage'](1);
                                this['cheeseLevel'] += 1
                            }
                        };
                        this['setLrem'](this['linesRemaining'])
                    } else {
                        let diff = x_garbage_height - x_new_cheese_height;
                        this['linesRemaining'] -= diff
                    }
                } else {
                    if (this['isPmode'](false) === 7) {
                        if (this['ISGAME'] && x_clear_score_type !== this['Scoring']['A']['TSPIN_DOUBLE']) {
                            this['Caption']['gameWarning'](i18n['notTSD'], i18n['notTSDInfo']);
                            this['practiceModeCompleted']()
                        };
                        if (this['ISGAME']) {
                            this['lrem']['textContent'] = this['gamedata']['TSD']
                        };
                        if (this['gamedata']['TSD'] === 20) {
                            this['gamedata']['TSD20'] = Math['round'](this['clock'] * 1000)
                        }
                    } else {
                        if (this['ISGAME'] && this['isPmode'](false) === 8) {
                            if (x_attack_type === this['Scoring']['A']['PERFECT_CLEAR']) {
                                this['gamedata']['lastPC'] = this['clock'];
                                this['lrem']['textContent'] = this['gamedata']['PCs'];
                                if (this['ISGAME']) {
                                    this['PCdata'] = {
                                        blocks: 0,
                                        lines: 0
                                    }
                                }
                            } else {
                                if (this['ISGAME']) {
                                    this['PCdata']['blocks']++;
                                    this['PCdata']['lines'] += x_amount_cleared_lines;
                                    this['evalPCmodeEnd']()
                                }
                            }
                        } else {
                            if (this['ISGAME'] && this['isPmode'](false) === 9) { //custom mode. sry dont have the code for this
                                let linesLeft = this['gamedata']['lines'] - x_amount_cleared_lines;
                                for (let i = 1; i <= x_amount_cleared_lines; ++i) {
                                    this['ModeManager']['on'](this['ModeManager'].LINE, linesLeft + i)
                                };
                                this['ModeManager']['on'](this['ModeManager'].LINECLEAR, x_amount_cleared_lines);
                                if (x_amount_attack > 0) {
                                    this['blockOrSendAttack'](x_amount_attack, time)
                                };
                                if (x_combo_attack > 0) {
                                    this['blockOrSendAttack'](x_combo_attack, time)
                                }
                            }
                        }
                    }
                }
            };
            if (!this['linesRemaining'] && this['ISGAME']) {
                this['practiceModeCompleted']()
            }
        } else {
            if (this['ISGAME']) {
                if (this['fourWideFlag'] && x_combo_attack && this['Live']['noFourWide']) {
                    this['Caption']['gameWarning'](i18n['fwDetect'], i18n['fwDetectInfo']);
                    while (x_combo_attack > 0) {
                        this['addGarbage'](1);
                        --x_combo_attack
                    }
                };
                let x_attack_sum = null,
                    x_combo_sum = null;
                if (x_amount_attack > 0) {
                    x_attack_sum = this['blockOrSendAttack'](x_amount_attack, time)
                };
                if (x_combo_attack > 0) {
                    x_combo_sum = this['blockOrSendAttack'](x_combo_attack, time)
                };
                if (x_attack_sum || x_combo_sum) {
                    this['Live']['sendAttack'](x_attack_sum, x_combo_sum, x_attack)
                }
            }
        };
        if (this['ISGAME']) {
            if (x_has_item) {
                this['Items']['pickup']()
            };
            if (this['R']['clearDelay'] && !this['redrawBlocked']) {
                this['play'] = false;
                this['redrawBlocked'] = true;
                this['animator'] = new LineClearAnimator(x_original_matrix, x_lineclear_height, this) //for
            }
        } else {
            this['v']['onLinesCleared'](x_amount_attack, x_combo_attack, x_attack)
        }
    } else {
        this['comboCounter'] = -1;
        let x_attack_type = null;
        if (this['spinPossible']) {
            x_attack_type = this['Scoring']['A']['TSPIN'];
            if (this['debug'] && this['ISGAME']) {
                this['Live']['showInChat']('', x_block['name'] + '-Spin')
            }
        } else {
            if (this['spinMiniPossible']) {
                x_attack_type = this['Scoring']['A']['TSPIN_MINI'];
                if (this['debug'] && this['ISGAME']) {
                    this['Live']['showInChat']('', x_block['name'] + '-Spin Mini')
                }
            }
        };
        if (x_attack_type) {
            this['score'](x_attack_type);
            if (this['ISGAME']) {
                let args = [x_attack_type, x_attack_type, false, -1];
                this['playSound'](this['SFXset']['getClearSFX'](...args), 1);
                if (this['VSEenabled']) {
                    this['playSound'](this['VSFXset']['getClearSFX'](...args), 2)
                }
            }
        };
        if (this['ISGAME'] && this['isPmode'](false) === 3) {
            var x_remaining_empty_lines = this['maxCheeseHeight'] - this['cheeseLevel'];
            if (x_remaining_empty_lines > 0) {
                var x_add_line_amount = Math['min'](x_remaining_empty_lines, this['linesRemaining'] - this['cheeseLevel']);
                for (let i = 0; i < x_add_line_amount; i++) {
                    this['addGarbage'](1)
                };
                this['cheeseLevel'] += x_add_line_amount
            }
        } else {
            if (this['ISGAME'] && this['isPmode'](false) === 8) {
                this['PCdata']['blocks']++;
                this['evalPCmodeEnd']()
            }
        }
    }
};
Game['prototype']['countGarbageHeight'] = function(upTo) {
    upTo = upTo || 20;
    var count = 0;
    for (var i = 0; i < upTo; i++) {
        let check1 = this['matrix'][19 - i][0]
        let check2 = this['matrix'][19 - i][1]
        if(typeof(check1)=="string")check1 = Number(check1.substring(0,1))
        if(typeof(check2)=="string")check2 = Number(check2.substring(0,1))
        if ( check1=== 8 || check2 === 8) {
            continue
        } else {
            count = i;
            break
        }
    };
    return count
};
Game['prototype']['addSolidGarbage'] = function() {
    if (this['solidHeight'] === 20) {
        return
    };
    let rowToAdd = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
    if(solidGarbageSetting == solidGarbageSettings.cut){
        rowToAdd = ["9080", "9120", "9120", "9120", "9120", "9120", "9120", "9120", "9120", "9040"]
    }
    this['deadline'] = this['matrix'][0]['slice'](0);
    var mLength = this['matrix']['length'];
    for (var i = 0; i < mLength; i++) {
        if ((mLength - i) > 1) {
            this['matrix'][i] = this['matrix'][i + 1]['slice'](0)
        } else {
            this['matrix'][i] = rowToAdd['slice'](0)
        }
    };
    this['solidHeight']++;
    if (this['ISGAME']) {
        this['Replay']['add'](new ReplayAction(this['Replay']['Action'].SGARBAGE_ADD, this['timestamp']()))
    }
};
Game['prototype']['addGarbage'] = function(garboAmount) {
    let holePos = undefined,
        pmode = this['isPmode'](false);
    if (garboAmount <= 0) {
        return 0
    };
    if (!this['R']['solidAttack']) {
        this['gamedata']['linesReceived'] += garboAmount;
        let rowToAdd = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
        if (pmode === 9 && this['garbageCols']['length']) {
            holePos = this['garbageCols']['shift']()
        } else {
            if (pmode !== 3 && pmode !== 4) {
                if (this['R']['mess'] >= 0) {
                    holePos = this['random'](0, 9)
                } else {
                    let holeRNG = 100 + this['R']['mess'];
                    if (!this['lastHolePos'] || (holeRNG > 0 && this.RNG() < (holeRNG / 100))) {
                        this['lastHolePos'] = this['random'](0, 9)
                    };
                    holePos = this['lastHolePos']
                }
            } else {
                holePos = this['lastHolePos'] = this['randomExcept'](0, 9, this['lastHolePos'])
            }
        };
        if (this['R']['gapW'] === 1) {
            rowToAdd[holePos] = 0
        } else {
            if (this['R']['baseBlockSet'] === 1) {
                holePos = holePos - (holePos % 2)
            };
            if (holePos + this['R']['gapW'] > 10) {
                holePos = 10 - this['R']['gapW']
            };
            for (let i = 0; i < this['R']['gapW']; ++i) {
                rowToAdd[holePos + i] = 0
            }
        };
        if (this['R']['gInv']) {
            for (let i = 0; i < rowToAdd['length']; ++i) {
                rowToAdd[i] = (rowToAdd[i] === 8) ? 0 : 8
            }
        };
        if(garbageSetting == garbageSettings.cut){
            for(let i = 0; i < rowToAdd.length; i++){
                if(rowToAdd[i]==0)continue
                let push1 = 0
                if(rowToAdd[i-1]>0)push1+=4
                if(rowToAdd[i+1]>0)push1+=8
                if(push1<10)push1 = "0"+push1.toString()
                rowToAdd[i] = "8" +push1.toString() + "0"
            }
        }
        if (garboAmount <= this['matrix']['length']) {
            this['deadline'] = this['matrix'][garboAmount - 1]['slice'](0)
        } else {
            this['deadline'] = rowToAdd['slice'](0)
        };
        var solidDiff = this['matrix']['length'] - this['solidHeight'];
        for (var i = 0; i < solidDiff; i++) {
            if ((solidDiff - i) > garboAmount) {
                this['matrix'][i] = this['matrix'][i + garboAmount]['slice'](0)
            } else {
                this['matrix'][i] = rowToAdd['slice'](0)
            }
        };
        if(garbageSetting == garbageSettings.blocky)this.v.redrawMatrix()
        this['GameStats']['get']('RECV')['set'](this['gamedata']['linesReceived']);
        let repAction
        if (!this['R']['gInv'] && this['R']['gapW'] === 1) {
            repAction = new ReplayAction(this['Replay']['Action'].GARBAGE_ADD, this['timestamp']());
            repAction['d'] = [garboAmount, holePos]
        } else {
            repAction = new ReplayAction(this['Replay']['Action'].AUX, this['timestamp']());
            repAction['d'] = [this['Replay']['AUX']['WIDE_GARBAGE_ADD'], garboAmount, holePos, this['R']['gapW'], this['R']['gInv'] ? 1 : 0]
        };
        this['Replay']['add'](repAction);
        this['updateGhostPiece'](true)
    } else {
        for (let i = 0; i < garboAmount; ++i) {
            this['addSolidGarbage']()
        };
        holePos = null
    };
    return holePos
};
(function() {
    'use strict';
    window.addEventListener('load',function(){
        loadSkin(skinURL,skinSize)
        setTimeout(loadSkin, 100, skinURL, skinSize)
    })
})()
