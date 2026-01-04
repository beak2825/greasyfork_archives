//#region Enums
const FileSection = {
    UNKNOWN         : 0,
    GENERAL         : 1 << 0,
    COLOURS         : 1 << 1,
    EDITOR          : 1 << 2,
    METADATA        : 1 << 3,
    TIMINGPOINTS    : 1 << 4,
    EVENTS          : 1 << 5,
    HITOBJECTS      : 1 << 6,
    DIFFICULTY      : 1 << 7,
    VARIABLES       : 1 << 8,
}

const PlayModes = {
    OSU             : 0,
    TAIKO           : 1,
    FRUITS          : 2,
    MANIA           : 3,
}

const HitObjectType = {
    NORMAL          : 1,
    SLIDER          : 2,
    NEWCOMBO        : 4,
    SPINNER         : 8,
    COLOURHAX       : 112,
    HOLD            : 128,
}

const Mod = {
    NM              : 0,
    NF              : 1 << 0,
    EZ              : 1 << 1,
    TD              : 1 << 2,
    HD              : 1 << 3,
    HR              : 1 << 4,
    SD              : 1 << 5,
    DT              : 1 << 6,
    RX              : 1 << 7,
    HT              : 1 << 8,
    NC              : 1 << 9,
    FL              : 1 << 10,
    AT              : 1 << 11,
    SO              : 1 << 12,
    AP              : 1 << 13,
    PF              : 1 << 14,
    K4              : 1 << 15,
    K5              : 1 << 16,
    K6              : 1 << 17,
    K7              : 1 << 18,
    K8              : 1 << 19,
    FI              : 1 << 20,
    RD              : 1 << 21,
    CN              : 1 << 22,
    TP              : 1 << 23,
    K9              : 1 << 24,
    CO              : 1 << 25,
    K1              : 1 << 26,
    K3              : 1 << 27,
    K2              : 1 << 28,
    V2              : 1 << 29,
    MR              : 1 << 30,
}
//#endregion

function clamp(value, min, max) {
    if (value > max)
        return max;
    if (value < min)
        return min;
    return value;
}

function applyModsToDiff(diff, mods) {
    if (Mod.EZ & mods)
        diff = Math.max(0, diff / 2);
    if (Mod.HR & mods)
        diff = Math.min(10, diff * 1.4);
    return diff;
}

function removeModsFromTime(time, mods) {
    if (Mod.DT & mods)
        return time * 1.5;
    else if (Mod.HT & mods)
        return time * 0.75;
    return time;
}

function applyModsToTime(time, mods) {
    if (Mod.DT & mods)
        return time / 1.5;
    else if (Mod.HT & mods)
        return time / 0.75;
    return time;
}

function diffRange(diff, min, mid, max, mods) {
    diff = applyModsToDiff(diff, mods);
    if (diff > 5)
        return mid + (max - mid) * (diff - 5) / 5;
    if (diff < 5)
        return mid - (mid - min) * (5 - diff) / 5;
    return mid;
}

function modsMultiplier(mods) {
    let multiplier = 1.0;
    if (Mod.NF & mods)
        multiplier *= 0.5;
    if (Mod.EZ & mods)
        multiplier *= 0.5;
    if (Mod.HT & mods)
        multiplier *= 0.3;
    if (Mod.HD & mods)
        multiplier *= 1.06;
    if (Mod.HR & mods)
        multiplier *= 1.06;
    if (Mod.DT & mods)
        multiplier *= 1.12;
    if (Mod.FL & mods)
        multiplier *= 1.12;
    if (Mod.SO & mods)
        multiplier *= 0.9;
    if ((Mod.RX & mods) || (Mod.AP & mods))
        multiplier *= 0;
    return multiplier;
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class HitObject {
    constructor(pos, startTime, endTime) {
        this.pos = pos;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class HitCircle extends HitObject {
    constructor(pos, startTime, endTime) {
        super(pos, startTime, endTime);
        this.objType = HitObjectType.NORMAL;
    }
}

class Slider extends HitObject {
    constructor(pos, startTime, endTime, repeatCount, length) {
        super(pos, startTime, endTime);
        this.repeatCount = repeatCount;
        this.pixelLength = length;
        this.ticks = 0;
        this.extraScore = false;
        this.objType = HitObjectType.SLIDER;
    }
}

class Spinner extends HitObject {
    constructor(pos, startTime, endTime) {
        super(pos, startTime, endTime);
        this.length = endTime - startTime;
        this.bonusPoints = 0;
        this.objType = HitObjectType.SPINNER
    }
}

class TimingPoint {
    constructor(offset, beatLength, timingChange) {
        this.offset = offset;
        this.beatLength = beatLength;
        this.timingChange = timingChange;
    }

    _bpmMultiplier() {
        if (this.beatLength >= 0)
            return 1;
        return clamp(-this.beatLength, 10, 1000) / 100.0;
    }
}

class BeatmapBase {
    //#region General
    mode = PlayModes.OSU;
    //#endregion
    
    //#region Metadata
    title = "";
    titleUnicode;
    artist = "";
    artistUnicode;
    creator = "";
    version = "";
    source = "";
    tags = [];
    beatmapId = 0;
    beatmapsetId = -1;
    //#endregion

    //#region Difficulty
    hp = 5.0;
    cs = 5.0;
    od = 5.0;
    ar = 5.0;
    sliderMultiplier = 1.4;
    sliderTickRate = 1.0;
    sliderScoringPointDistance;
    //#endregion

    //#region HitObjects
    countCircles = 0;
    countSliders = 0;
    countSpinners = 0;
    hitObjects = []
    //#endregion

    //#region Others
    beatmapVersion = 14;
    drainLength = 0;
    totalLength = 0;
    timingPoints = [];
    maxCombo;
    maxScore;
    //#endregion
}

class Beatmap extends BeatmapBase {
    constructor(beatmapString, mods = 0) {
        super();
        this.parseData(beatmapString, mods);
    }

    /**
     * Parse beatmap file
     * @param {string} filename - Path of .osu file
     * @param {number} mods - Integer value of the mods, defaults to `0` (NoMod)
     */
    parseFile(filename, mods = 0) {
        const data = fs.readFileSync(filename, "utf8");
        const lines = data.split(/\r?\n/);
        this._processHeaders(lines);
        this._parse(lines);
        this._parseObjects(mods);
    }

    /**
     * Parse beatmap data
     * @param {string} [data] String data of .osu file
     * @param {number} [mods=0] Integer value of the mods, defaults to `0` (NoMod)
     */
    parseData(data, mods = 0) {
        const lines = data.split(/\r?\n/);
        this._processHeaders(lines);
        this._parse(lines);
        this._parseObjects(mods);
    }

    _processHeaders(lines) {
        let arIsOd = true;
        let currentSection = FileSection.UNKNOWN;
        let firstTime = -1;
        let lastTime = -1;
        let realLastTime = -1;
        let lastTimeStr = "";
        let realLastTimeStr = "";
        let breakTime = 0;
        try {
            try {
                let line = lines[0];
                if (line.indexOf("osu file format") == 0) {
                    this.beatmapVersion = parseInt(line.substring(line.lastIndexOf("v") + 1));
                }
            }
            catch (e) {
                console.log(`Missing file format for ${this.filename}`);
            }
            for (let i = 1; i < lines.length; i++) {
                let line = lines[i].trim();
                let left, right = "";
                if (line.length == 0 || line.startsWith("//"))
                    continue;
                
                if (currentSection != FileSection.HITOBJECTS) {
                    let kv = line.split(":", 2);
                    if (kv.length > 1) {
                        left = kv[0].trim();
                        right = kv[1].trim();
                    }
                    else if (line.charAt(0) == '[') {
                        try {
                            currentSection = FileSection[line.replace(/^\[+|\]+$/g, '').toUpperCase()]
                        }
                        catch {
                        }
                        continue;
                    }
                }
                switch (currentSection) {
                    case FileSection.GENERAL:
                        if (left == "Mode")
                            this.mode = parseInt(right);
                        break;
                    case FileSection.METADATA:
                        switch (left) {
                            case "Artist":
                                this.artist = right
                                break;
                            case "ArtistUnicode":
                                this.artistUnicode = right
                                break;
                            case "Title":
                                this.title = right
                                break;
                            case "TitleUnicode":
                                this.titleUnicode = right
                                break;
                            case "Creator":
                                this.creator = right
                                break;
                            case "Version":
                                this.version = right
                                break;
                            case "Tags":
                                this.tags = right
                                break;
                            case "Source":
                                this.source = right
                                break;
                            case "BeatmapID":
                                this.beatmapId = parseInt(right)
                                break;
                            case "BeatmapSetID":
                                this.beatmapsetId = parseInt(right)
                                break;
                        }
                        break;
                    case FileSection.DIFFICULTY:
                        switch (left) {
                            case "HPDrainRate":
                                this.hp = Math.min(10, Math.max(0, parseFloat(right)));
                                break;
                            case "CircleSize":
                                if (this.mode == PlayModes.MANIA)
                                    this.cs = Math.min(18, Math.max(1, parseFloat(right)));
                                else
                                    this.cs = Math.min(10, Math.max(0, parseFloat(right)));
                                break;
                            case "OverallDifficulty":
                                this.od = Math.min(10, Math.max(0, parseFloat(right)));
                                if (arIsOd)
                                    this.ar = this.od;
                                break;
                            case "SliderMultiplier":
                                this.sliderMultiplier = Math.max(0.4, Math.min(3.6, parseFloat(right)));
                                break;
                            case "SliderTickRate":
                                this.sliderTickRate = Math.max(0.5, Math.min(8, parseFloat(right)));
                                break;
                            case "ApproachRate":
                                this.ar = Math.min(10, Math.max(0, parseFloat(right)));
                                arIsOd = false;
                                break;
                        }
                        break;
                        case FileSection.EVENTS:
                            if (line.charAt(0) == '2') {
                                let split = line.split(",");
                                breakTime += parseInt(split[2]) - parseInt(split[1]);
                            }
                            break;
                        case FileSection.TIMINGPOINTS:
                            try {
                                let split = line.split(",");
                                if (split.length < 2)
                                    continue;
                                let offset = parseFloat(split[0].trim());
                                let beatLength = parseFloat(split[1].trim());
                                let timingChange = true;
                                if (split.length > 6)
                                    timingChange = (split[6].charAt(0) == '1');
                                let tp = new TimingPoint(offset, beatLength, timingChange);
                                this.timingPoints.push(tp);
                            }
                            catch (e) {
                                console.log(`Error parsing timing points for ${this.filename}\n${e}`);
                            }
                            break;
                        case FileSection.HITOBJECTS:
                            let split = line.split(",", 7);

                            if (firstTime == -1)
                                firstTime = parseInt(split[2]);
                            
                            let objType = parseInt(split[3]) & 139;

                            switch (objType) {
                                case HitObjectType.NORMAL:
                                    this.countCircles++;
                                    lastTimeStr = split[2];
                                    realLastTimeStr = lastTimeStr;
                                    break;
                                case HitObjectType.SLIDER:
                                    this.countSliders++;
                                    lastTimeStr = split[2];
                                    realLastTimeStr = lastTimeStr;
                                    break;
                                case HitObjectType.SPINNER:
                                    this.countSpinners++;
                                    lastTimeStr = split[2];
                                    realLastTimeStr = split[5];
                                    break;
                                case HitObjectType.HOLD:
                                    this.countSliders++;
                                    lastTimeStr = split[5].split(":")[0];
                                    realLastTimeStr = lastTimeStr;
                                    break;
                            }
                            break;
                }
            }
        }
        catch (e) {
            console.log(`An error occured while processing ${this.filename}\n${e}`);
        }

        if (lastTimeStr.length > 0)
            lastTime = parseInt(lastTimeStr);
        if (realLastTimeStr.length > 0)
            realLastTime = parseInt(realLastTimeStr);

        this.drainLength = Math.trunc((lastTime - firstTime - breakTime) / 1000);
        this.totalLength = realLastTime;
        this.sliderScoringPointDistance = (100 * this.sliderMultiplier / this.sliderTickRate);
    }

    _parse(lines) {
        let currentSection = FileSection.UNKNOWN;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.length == 0 || line.startsWith(" ") || line.startsWith("_") || line.startsWith("//"))
                continue;
            if (line.charAt(0) == '[') {
                try {
                    currentSection = FileSection[line.replace(/^\[+|\]+$/g, '').toUpperCase()]
                }
                catch {
                }
                continue;
            }
            
            if (currentSection == FileSection.HITOBJECTS) {
                let split = line.split(",");
                let objType = parseInt(split[3]) & 139;
                let x = Math.max(0, Math.min(512, parseInt(split[0])));
                let y = Math.max(0, Math.min(512, parseInt(split[1])));
                let pos = new Vector2(x, y);
                let time = parseInt(split[2]);
                let ho = null;

                switch (objType) {
                    case HitObjectType.NORMAL:
                        ho = new HitCircle(pos, time, time);
                        break;
                    case HitObjectType.SLIDER:
                        let length = 0;
                        let repeatCount = parseInt(split[6]);
                        if (split.length > 7)
                            length = parseFloat(split[7]);
                        ho = new Slider(pos, time, time, Math.max(1, repeatCount), length);
                        break;
                    case HitObjectType.SPINNER:
                        let end_time = parseInt(split[5]);
                        ho = new Spinner(pos, time, end_time);
                        break;
                }

                if (ho != null)
                    this.hitObjects.push(ho);
            }
        }
    }

    _parseObjects(mods) {
        this.maxCombo = 0;
        this.maxScore = 0;
        let scoreMult = this._diffPpyStars() * modsMultiplier(mods);
        for (let i = 0; i < this.hitObjects.length; i++) {
            let ho = this.hitObjects[i];
            switch (ho.objType) {
                case HitObjectType.NORMAL:
                    this.maxScore += 300;
                    this.maxScore += Math.trunc(Math.max(0, this.maxCombo - 1) * (300 * scoreMult) / 25);
                    this.maxCombo++;
                    break;
                case HitObjectType.SLIDER:
                    this.maxScore += 30;
                    if (!this.parsed)
                        this._parseSlider(ho);
                    this.maxScore += 10 * ho.ticks + 20 * ho.repeatCount;
                    if (ho.extraScore)
                        this.maxScore += 20;
                    this.maxCombo += 1 + ho.ticks;
                    this.maxScore += 300
                    this.maxScore += Math.trunc(Math.max(0, this.maxCombo - 1) * (300 * scoreMult) / 25);
                    break;
                case HitObjectType.SPINNER:
                    this._parseSpinner(ho, mods);
                    this.maxScore += ho.bonusPoints;
                    this.maxScore += 300;
                    this.maxScore += Math.trunc(Math.max(0, this.maxCombo - 1) * (300 * scoreMult) / 25);
                    this.maxCombo++;
                    break;
            }
        }
        this.maxScore = Math.min(this.maxScore, 2147483647);
        this.parsed = true;
        this.mods = mods;
    }

    _parseSpinner(ho, mods) {
        ho.bonusPoints = 0;
        let rotRatio = diffRange(this.od, 3, 5, 7.5, mods);
        let rotReq = Math.trunc(ho.length / 1000 * rotRatio);
        let length = ho.length;
        let firstFrame = Math.floor(removeModsFromTime(1000 / 60, mods));
        let maxAccel = applyModsToTime(0.00008 + Math.max(0, (5000 - length) / 1000 / 2000), mods);
        if (!(Mod.SO & mods))
            length = Math.max(0, length - firstFrame);

        let rot1 = 0.0;
        if (0.05 / maxAccel <= length)
            rot1 = (0.05 / maxAccel * 0.05 / 2) / Math.PI;
        else
            rot1 = (length * 0.05 / 2) / Math.PI;   
        let rot2 = (Math.max(0, (length - 0.05 / maxAccel)) * 0.05) / Math.PI;

        let adj = 0.0;
        // We want to do riemann sum (with 32-bit floats), but looping through every ms of the spinner is rather inefficient
        // Instead we take the integral/area (`rot1` + `rot2`) and add a small adjustment
        // https://www.desmos.com/calculator/q2fmcg2wqy
        // Using step-wise functions
        // DT: https://www.desmos.com/calculator/c4fj2mbx9k
        if (ho.length < 25)
            adj = 0.0;
        else if (ho.length < 54)
            adj = -0.000270059419975 * Math.pow(ho.length, 2) + 0.0211619792196 * ho.length - 0.360204188548;
        else if (ho.length < 550)
            adj = 7.08877768273e-8 * ho.length - 0.00792123896377;
        else if (ho.length < 1039)
            adj = -3.87996955927e-7 * ho.length - 0.00766882330492;
        else if (ho.length < 4300)
            adj = 5.56455532781e-7 * ho.length - 0.00864999032506;
        else if (ho.length < 5003)
            adj = -1.52204906849e-157 * Math.pow(ho.length, 41.3873070645) + 1.55461382298e-8 * Math.pow(ho.length, 1.36603917014) - 0.00768603737329;
        else if (ho.length < 16579)
            adj = 0.000000576271509962 * ho.length - 0.00900373898631;
        else if (ho.length < 64789)
            adj = -0.0000146814720605 * ho.length + 0.243958571556;
        else if (ho.length < 258373)
            adj = 0.0000463528165568 * ho.length - 3.71039008873;
        else if (ho.length < 512573)
            adj = -0.00019778694081 * ho.length + 59.3687754661;
        else
            adj = 0.00029049430919 * ho.length - 190.91100969;

        let rot = Math.trunc(Math.max(0, rot1 + rot2 - adj));
        for (let i = 1; i <= rot; i++) {
            if (i > rotReq + 3 && (i - (rotReq + 3)) % 2 == 0)
                ho.bonusPoints += 1100;
            else if (i > 1 && i % 2 == 0)
                ho.bonusPoints += 100;
        }
    }

    _parseSlider(ho) {
        let velocity = this._sliderVecityAt(ho.startTime);
        let beatLength = this._beatLengthAt(ho.startTime);
        let tickDist;
        if (this.beatmapVersion < 8)
            tickDist = this.sliderScoringPointDistance;
        else
            tickDist = this.sliderScoringPointDistance / this._bpmMultAt(ho.startTime);
        
        let minTickDist = 0.01 * velocity;
        let scoringDist = ho.pixelLength;
        while (scoringDist >= tickDist) {
            scoringDist -= tickDist;
            if (scoringDist <= minTickDist)
                break;
            ho.ticks += 1
        }
        
        let duration = Math.trunc(ho.pixelLength / (100 * this.sliderMultiplier) * beatLength);
        
        if (ho.ticks > 0) {
            let tickDuration = Math.trunc(ho.ticks * tickDist / (100 * this.sliderMultiplier) * beatLength);
            if (tickDuration >= duration - 36 && ho.repeatCount % 2)
                ho.extraScore = true;
        }
        ho.ticks++;
        ho.ticks *= ho.repeatCount;
        ho.endTime = ho.startTime + duration * ho.repeatCount;
    }

    _sliderVecityAt(time) {
        let beatLength = this._beatLengthAt(time);

        if (beatLength > 0)
            return this.sliderScoringPointDistance * this.sliderTickRate * (1000 / beatLength)
        return this.sliderScoringPointDistance * this.sliderTickRate;
    }

    _beatLengthAt(time) {
        if (this.timingPoints.length == 0)
            return 0;
        
        let point = 0;
        let samplePoint = 0;
        for (let i = 0; i < this.timingPoints.length; i++) {
            if (this.timingPoints[i].offset <= time) {
                if (this.timingPoints[i].timingChange)
                    point = i;
                else
                    samplePoint = i;
            }
        }

        let mult = 1.0;
        
        if (samplePoint > point && this.timingPoints[samplePoint].beatLength< 0)
            mult = this.timingPoints[samplePoint]._bpmMultiplier();

        return this.timingPoints[point].beatLength * mult;
    }

    _bpmMultAt(time) {
        let tp = this._timingPointAt(time);
        if (tp == null)
            return 1;
        return tp._bpmMultiplier();
    }

    _timingPointAt(time) {
        if (this.timingPoints.length == 0)
            return null;
        
        let point = 0;
        for (let i = 0; i < this.timingPoints.length; i++) {
            if (this.timingPoints[i].offset <= time)
                point = i;
        }

        return this.timingPoints[point];
    }

    _diffPpyStars() {
        let objFactor = clamp((this.hitObjects.length / Math.fround(this.drainLength)) * 8, 0, 16);
        return Math.round((Math.fround(this.hp) + Math.fround(this.od) + Math.fround(this.cs) + Math.fround(objFactor)) / 38 * 5);
    }
}