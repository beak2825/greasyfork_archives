// ==UserScript==
// @name         读取二维码
// @namespace    https://viayoo.com/
// @version      1.0beta
// @description  长按二维码识别，就是单独一个界面有点烦人
// @author       404 Not Found
// @run-at       document-start
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454611/%E8%AF%BB%E5%8F%96%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/454611/%E8%AF%BB%E5%8F%96%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==
!(()=>{
    let key = "LemonScriptMutex_3745_0.7.2";
    if (window[key]) return;
    window[key] = !0;
    let 按住时间 = 500, 动态捕获 = !!1,
        加载延时 = 200, 动态加载上限 = 100,
        代理服务器 = 'https://netnr-proxy.azurewebsites.net/',
        带协议 = !!0,
        识别类型 = ['data_matrix', 'aztec', 'qr_code'],
        eimg, decoder = function() {
            var GridSampler = {};

            function ECB(count, dataCodewords) {
                this.count = count, this.dataCodewords = dataCodewords, this.__defineGetter__("Count", function() {
                    return this.count
                }), this.__defineGetter__("DataCodewords", function() {
                    return this.dataCodewords
                })
            }

            function ECBlocks(ecCodewordsPerBlock, ecBlocks1, ecBlocks2) {
                this.ecCodewordsPerBlock = ecCodewordsPerBlock, this.ecBlocks = ecBlocks2 ? new Array(ecBlocks1, ecBlocks2) : new Array(ecBlocks1), this.__defineGetter__("ECCodewordsPerBlock", function() {
                    return this.ecCodewordsPerBlock
                }), this.__defineGetter__("TotalECCodewords", function() {
                    return this.ecCodewordsPerBlock * this.NumBlocks
                }), this.__defineGetter__("NumBlocks", function() {
                    for (var total = 0, i = 0; i < this.ecBlocks.length; i++) total += this.ecBlocks[i].length;
                    return total
                }), this.getECBlocks = function() {
                    return this.ecBlocks
                }
            }

            function Version(versionNumber, alignmentPatternCenters, ecBlocks1, ecBlocks2, ecBlocks3, ecBlocks4) {
                this.versionNumber = versionNumber, this.alignmentPatternCenters = alignmentPatternCenters, this.ecBlocks = new Array(ecBlocks1, ecBlocks2, ecBlocks3, ecBlocks4);
                for (var total = 0, ecCodewords = ecBlocks1.ECCodewordsPerBlock, ecbArray = ecBlocks1.getECBlocks(), i = 0; i < ecbArray.length; i++) {
                    var ecBlock = ecbArray[i];
                    total += ecBlock.Count * (ecBlock.DataCodewords + ecCodewords)
                }
                this.totalCodewords = total, this.__defineGetter__("VersionNumber", function() {
                    return this.versionNumber
                }), this.__defineGetter__("AlignmentPatternCenters", function() {
                    return this.alignmentPatternCenters
                }), this.__defineGetter__("TotalCodewords", function() {
                    return this.totalCodewords
                }), this.__defineGetter__("DimensionForVersion", function() {
                    return 17 + 4 * this.versionNumber
                }), this.buildFunctionPattern = function() {
                    var dimension = this.DimensionForVersion,
                        bitMatrix = new BitMatrix(dimension);
                    bitMatrix.setRegion(0, 0, 9, 9), bitMatrix.setRegion(dimension - 8, 0, 8, 9), bitMatrix.setRegion(0, dimension - 8, 9, 8);
                    for (var max = this.alignmentPatternCenters.length, x = 0; x < max; x++)
                        for (var i = this.alignmentPatternCenters[x] - 2, y = 0; y < max; y++) 0 == x && (0 == y || y == max - 1) || x == max - 1 && 0 == y || bitMatrix.setRegion(this.alignmentPatternCenters[y] - 2, i, 5, 5);
                    return bitMatrix.setRegion(6, 9, 1, dimension - 17), bitMatrix.setRegion(9, 6, dimension - 17, 1), this.versionNumber > 6 && (bitMatrix.setRegion(dimension - 11, 0, 3, 6), bitMatrix.setRegion(0, dimension - 11, 6, 3)), bitMatrix
                }, this.getECBlocksForLevel = function(ecLevel) {
                    return this.ecBlocks[ecLevel.ordinal()]
                }
            }

            function PerspectiveTransform(a11, a21, a31, a12, a22, a32, a13, a23, a33) {
                this.a11 = a11, this.a12 = a12, this.a13 = a13, this.a21 = a21, this.a22 = a22, this.a23 = a23, this.a31 = a31, this.a32 = a32, this.a33 = a33, this.transformPoints1 = function(points) {
                    for (var max = points.length, a11 = this.a11, a12 = this.a12, a13 = this.a13, a21 = this.a21, a22 = this.a22, a23 = this.a23, a31 = this.a31, a32 = this.a32, a33 = this.a33, i = 0; i < max; i += 2) {
                        var x = points[i],
                            y = points[i + 1],
                            denominator = a13 * x + a23 * y + a33;
                        points[i] = (a11 * x + a21 * y + a31) / denominator, points[i + 1] = (a12 * x + a22 * y + a32) / denominator
                    }
                }, this.transformPoints2 = function(xValues, yValues) {
                    for (var n = xValues.length, i = 0; i < n; i++) {
                        var x = xValues[i],
                            y = yValues[i],
                            denominator = this.a13 * x + this.a23 * y + this.a33;
                        xValues[i] = (this.a11 * x + this.a21 * y + this.a31) / denominator, yValues[i] = (this.a12 * x + this.a22 * y + this.a32) / denominator
                    }
                }, this.buildAdjoint = function() {
                    return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21)
                }, this.times = function(other) {
                    return new PerspectiveTransform(this.a11 * other.a11 + this.a21 * other.a12 + this.a31 * other.a13, this.a11 * other.a21 + this.a21 * other.a22 + this.a31 * other.a23, this.a11 * other.a31 + this.a21 * other.a32 + this.a31 * other.a33, this.a12 * other.a11 + this.a22 * other.a12 + this.a32 * other.a13, this.a12 * other.a21 + this.a22 * other.a22 + this.a32 * other.a23, this.a12 * other.a31 + this.a22 * other.a32 + this.a32 * other.a33, this.a13 * other.a11 + this.a23 * other.a12 + this.a33 * other.a13, this.a13 * other.a21 + this.a23 * other.a22 + this.a33 * other.a23, this.a13 * other.a31 + this.a23 * other.a32 + this.a33 * other.a33)
                }
            }

            function Detector(image) {
                this.image = image, this.resultPointCallback = null, this.sizeOfBlackWhiteBlackRun = function(fromX, fromY, toX, toY) {
                    var steep = Math.abs(toY - fromY) > Math.abs(toX - fromX);
                    if (steep) {
                        var temp = fromX;
                        fromX = fromY, fromY = temp, temp = toX, toX = toY, toY = temp
                    }
                    for (var dx = Math.abs(toX - fromX), dy = Math.abs(toY - fromY), error = -dx >> 1, ystep = fromY < toY ? 1 : -1, xstep = fromX < toX ? 1 : -1, state = 0, x = fromX, y = fromY; x != toX; x += xstep) {
                        var realX = steep ? y : x,
                            realY = steep ? x : y;
                        if (1 == state ? this.image[realX + realY * qrcode.width] && state++ : this.image[realX + realY * qrcode.width] || state++, 3 == state) {
                            var diffX = x - fromX,
                                diffY = y - fromY;
                            return Math.sqrt(diffX * diffX + diffY * diffY)
                        }
                        if ((error += dy) > 0) {
                            if (y == toY) break;
                            y += ystep, error -= dx
                        }
                    }
                    var diffX2 = toX - fromX,
                        diffY2 = toY - fromY;
                    return Math.sqrt(diffX2 * diffX2 + diffY2 * diffY2)
                }, this.sizeOfBlackWhiteBlackRunBothWays = function(fromX, fromY, toX, toY) {
                    var result = this.sizeOfBlackWhiteBlackRun(fromX, fromY, toX, toY),
                        scale = 1,
                        otherToX = fromX - (toX - fromX);
                    otherToX < 0 ? (scale = fromX / (fromX - otherToX), otherToX = 0) : otherToX >= qrcode.width && (scale = (qrcode.width - 1 - fromX) / (otherToX - fromX), otherToX = qrcode.width - 1);
                    var otherToY = Math.floor(fromY - (toY - fromY) * scale);
                    return scale = 1, otherToY < 0 ? (scale = fromY / (fromY - otherToY), otherToY = 0) : otherToY >= qrcode.height && (scale = (qrcode.height - 1 - fromY) / (otherToY - fromY), otherToY = qrcode.height - 1), otherToX = Math.floor(fromX + (otherToX - fromX) * scale), (result += this.sizeOfBlackWhiteBlackRun(fromX, fromY, otherToX, otherToY)) - 1
                }, this.calculateModuleSizeOneWay = function(pattern, otherPattern) {
                    var moduleSizeEst1 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(pattern.X), Math.floor(pattern.Y), Math.floor(otherPattern.X), Math.floor(otherPattern.Y)),
                        moduleSizeEst2 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(otherPattern.X), Math.floor(otherPattern.Y), Math.floor(pattern.X), Math.floor(pattern.Y));
                    return isNaN(moduleSizeEst1) ? moduleSizeEst2 / 7 : isNaN(moduleSizeEst2) ? moduleSizeEst1 / 7 : (moduleSizeEst1 + moduleSizeEst2) / 14
                }, this.calculateModuleSize = function(topLeft, topRight, bottomLeft) {
                    return (this.calculateModuleSizeOneWay(topLeft, topRight) + this.calculateModuleSizeOneWay(topLeft, bottomLeft)) / 2
                }, this.distance = function(pattern1, pattern2) {
                    var xDiff = pattern1.X - pattern2.X,
                        yDiff = pattern1.Y - pattern2.Y;
                    return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
                }, this.computeDimension = function(topLeft, topRight, bottomLeft, moduleSize) {
                    var dimension = 7 + (Math.round(this.distance(topLeft, topRight) / moduleSize) + Math.round(this.distance(topLeft, bottomLeft) / moduleSize) >> 1);
                    switch (3 & dimension) {
                        case 0:
                            dimension++;
                            break;
                        case 2:
                            dimension--;
                            break;
                        case 3:
                            throw "Error"
                    }
                    return dimension
                }, this.findAlignmentInRegion = function(overallEstModuleSize, estAlignmentX, estAlignmentY, allowanceFactor) {
                    var allowance = Math.floor(allowanceFactor * overallEstModuleSize),
                        alignmentAreaLeftX = Math.max(0, estAlignmentX - allowance),
                        alignmentAreaRightX = Math.min(qrcode.width - 1, estAlignmentX + allowance);
                    if (alignmentAreaRightX - alignmentAreaLeftX < 3 * overallEstModuleSize) throw "Error";
                    var alignmentAreaTopY = Math.max(0, estAlignmentY - allowance),
                        alignmentAreaBottomY = Math.min(qrcode.height - 1, estAlignmentY + allowance);
                    return new function(image, startX, startY, width, height, moduleSize, resultPointCallback) {
                        this.image = image, this.possibleCenters = new Array, this.startX = startX, this.startY = startY, this.width = width, this.height = height, this.moduleSize = moduleSize, this.crossCheckStateCount = new Array(0, 0, 0), this.resultPointCallback = resultPointCallback, this.centerFromEnd = function(stateCount, end) {
                            return end - stateCount[2] - stateCount[1] / 2
                        }, this.foundPatternCross = function(stateCount) {
                            for (var moduleSize = this.moduleSize, maxVariance = moduleSize / 2, i = 0; i < 3; i++)
                                if (Math.abs(moduleSize - stateCount[i]) >= maxVariance) return !1;
                            return !0
                        }, this.crossCheckVertical = function(startI, centerJ, maxCount, originalStateCountTotal) {
                            var image = this.image,
                                maxI = qrcode.height,
                                stateCount = this.crossCheckStateCount;
                            stateCount[0] = 0, stateCount[1] = 0, stateCount[2] = 0;
                            for (var i = startI; i >= 0 && image[centerJ + i * qrcode.width] && stateCount[1] <= maxCount;) stateCount[1]++, i--;
                            if (i < 0 || stateCount[1] > maxCount) return NaN;
                            for (; i >= 0 && !image[centerJ + i * qrcode.width] && stateCount[0] <= maxCount;) stateCount[0]++, i--;
                            if (stateCount[0] > maxCount) return NaN;
                            for (i = startI + 1; i < maxI && image[centerJ + i * qrcode.width] && stateCount[1] <= maxCount;) stateCount[1]++, i++;
                            if (i == maxI || stateCount[1] > maxCount) return NaN;
                            for (; i < maxI && !image[centerJ + i * qrcode.width] && stateCount[2] <= maxCount;) stateCount[2]++, i++;
                            if (stateCount[2] > maxCount) return NaN;
                            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2];
                            return 5 * Math.abs(stateCountTotal - originalStateCountTotal) >= 2 * originalStateCountTotal ? NaN : this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, i) : NaN
                        }, this.handlePossibleCenter = function(stateCount, i, j) {
                            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2],
                                centerJ = this.centerFromEnd(stateCount, j),
                                centerI = this.crossCheckVertical(i, Math.floor(centerJ), 2 * stateCount[1], stateCountTotal);
                            if (!isNaN(centerI)) {
                                for (var estimatedModuleSize = (stateCount[0] + stateCount[1] + stateCount[2]) / 3, max = this.possibleCenters.length, index = 0; index < max; index++) {
                                    var center = this.possibleCenters[index];
                                    if (center.aboutEquals(estimatedModuleSize, centerI, centerJ)) return new AlignmentPattern(centerJ, centerI, estimatedModuleSize)
                                }
                                var point = new AlignmentPattern(centerJ, centerI, estimatedModuleSize);
                                this.possibleCenters.push(point), null != this.resultPointCallback && this.resultPointCallback.foundPossibleResultPoint(point)
                            }
                            return null
                        }, this.find = function() {
                            for (var startX = this.startX, height = this.height, maxJ = startX + width, middleI = startY + (height >> 1), stateCount = new Array(0, 0, 0), iGen = 0; iGen < height; iGen++) {
                                var i = middleI + (0 == (1 & iGen) ? iGen + 1 >> 1 : -(iGen + 1 >> 1));
                                stateCount[0] = 0, stateCount[1] = 0, stateCount[2] = 0;
                                for (var j = startX; j < maxJ && !image[j + qrcode.width * i];) j++;
                                for (var currentState = 0; j < maxJ;) {
                                    if (image[j + i * qrcode.width])
                                        if (1 == currentState) stateCount[currentState]++;
                                        else if (2 == currentState) {
                                        if (this.foundPatternCross(stateCount)) {
                                            var confirmed = this.handlePossibleCenter(stateCount, i, j);
                                            if (null != confirmed) return confirmed
                                        }
                                        stateCount[0] = stateCount[2], stateCount[1] = 1, stateCount[2] = 0, currentState = 1
                                    } else stateCount[++currentState]++;
                                    else 1 == currentState && currentState++, stateCount[currentState]++;
                                    j++
                                }
                                if (this.foundPatternCross(stateCount)) {
                                    var confirmed = this.handlePossibleCenter(stateCount, i, maxJ);
                                    if (null != confirmed) return confirmed
                                }
                            }
                            if (0 != this.possibleCenters.length) return this.possibleCenters[0];
                            throw "没有找到足够的对齐线"
                        }
                    }(this.image, alignmentAreaLeftX, alignmentAreaTopY, alignmentAreaRightX - alignmentAreaLeftX, alignmentAreaBottomY - alignmentAreaTopY, overallEstModuleSize, this.resultPointCallback).find()
                }, this.createTransform = function(topLeft, topRight, bottomLeft, alignmentPattern, dimension) {
                    var bottomRightX, bottomRightY, sourceBottomRightX, sourceBottomRightY, dimMinusThree = dimension - 3.5;
                    return null != alignmentPattern ? (bottomRightX = alignmentPattern.X, bottomRightY = alignmentPattern.Y, sourceBottomRightX = sourceBottomRightY = dimMinusThree - 3) : (bottomRightX = topRight.X - topLeft.X + bottomLeft.X, bottomRightY = topRight.Y - topLeft.Y + bottomLeft.Y, sourceBottomRightX = sourceBottomRightY = dimMinusThree), PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, dimMinusThree, 3.5, sourceBottomRightX, sourceBottomRightY, 3.5, dimMinusThree, topLeft.X, topLeft.Y, topRight.X, topRight.Y, bottomRightX, bottomRightY, bottomLeft.X, bottomLeft.Y)
                }, this.sampleGrid = function(image, transform, dimension) {
                    return GridSampler.sampleGrid3(image, dimension, transform)
                }, this.processFinderPatternInfo = function(info) {
                    var topLeft = info.TopLeft,
                        topRight = info.TopRight,
                        bottomLeft = info.BottomLeft,
                        moduleSize = this.calculateModuleSize(topLeft, topRight, bottomLeft);
                    if (moduleSize < 1) throw "Error";
                    var dimension = this.computeDimension(topLeft, topRight, bottomLeft, moduleSize),
                        provisionalVersion = Version.getProvisionalVersionForDimension(dimension),
                        modulesBetweenFPCenters = provisionalVersion.DimensionForVersion - 7,
                        alignmentPattern = null;
                    if (provisionalVersion.AlignmentPatternCenters.length > 0)
                        for (var bottomRightX = topRight.X - topLeft.X + bottomLeft.X, bottomRightY = topRight.Y - topLeft.Y + bottomLeft.Y, correctionToTopLeft = 1 - 3 / modulesBetweenFPCenters, estAlignmentX = Math.floor(topLeft.X + correctionToTopLeft * (bottomRightX - topLeft.X)), estAlignmentY = Math.floor(topLeft.Y + correctionToTopLeft * (bottomRightY - topLeft.Y)), i = 4; i <= 16; i <<= 1) {
                            alignmentPattern = this.findAlignmentInRegion(moduleSize, estAlignmentX, estAlignmentY, i);
                            break
                        }
                    var transform = this.createTransform(topLeft, topRight, bottomLeft, alignmentPattern, dimension);
                    return new function(bits, points) {
                        this.bits = bits, this.points = points
                    }(this.sampleGrid(this.image, transform, dimension), null == alignmentPattern ? new Array(bottomLeft, topLeft, topRight) : new Array(bottomLeft, topLeft, topRight, alignmentPattern))
                }, this.detect = function() {
                    var info = (new function() {
                        this.image = null, this.possibleCenters = [], this.hasSkipped = !1, this.crossCheckStateCount = new Array(0, 0, 0, 0, 0), this.resultPointCallback = null, this.__defineGetter__("CrossCheckStateCount", function() {
                            return this.crossCheckStateCount[0] = 0, this.crossCheckStateCount[1] = 0, this.crossCheckStateCount[2] = 0, this.crossCheckStateCount[3] = 0, this.crossCheckStateCount[4] = 0, this.crossCheckStateCount
                        }), this.foundPatternCross = function(stateCount) {
                            for (var totalModuleSize = 0, i = 0; i < 5; i++) {
                                var count = stateCount[i];
                                if (0 == count) return !1;
                                totalModuleSize += count
                            }
                            if (totalModuleSize < 7) return !1;
                            var moduleSize = Math.floor((totalModuleSize << INTEGER_MATH_SHIFT) / 7),
                                maxVariance = Math.floor(moduleSize / 2);
                            return Math.abs(moduleSize - (stateCount[0] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[1] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(3 * moduleSize - (stateCount[2] << INTEGER_MATH_SHIFT)) < 3 * maxVariance && Math.abs(moduleSize - (stateCount[3] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[4] << INTEGER_MATH_SHIFT)) < maxVariance
                        }, this.centerFromEnd = function(stateCount, end) {
                            return end - stateCount[4] - stateCount[3] - stateCount[2] / 2
                        }, this.crossCheckVertical = function(startI, centerJ, maxCount, originalStateCountTotal) {
                            for (var image = this.image, maxI = qrcode.height, stateCount = this.CrossCheckStateCount, i = startI; i >= 0 && image[centerJ + i * qrcode.width];) stateCount[2]++, i--;
                            if (i < 0) return NaN;
                            for (; i >= 0 && !image[centerJ + i * qrcode.width] && stateCount[1] <= maxCount;) stateCount[1]++, i--;
                            if (i < 0 || stateCount[1] > maxCount) return NaN;
                            for (; i >= 0 && image[centerJ + i * qrcode.width] && stateCount[0] <= maxCount;) stateCount[0]++, i--;
                            if (stateCount[0] > maxCount) return NaN;
                            for (i = startI + 1; i < maxI && image[centerJ + i * qrcode.width];) stateCount[2]++, i++;
                            if (i == maxI) return NaN;
                            for (; i < maxI && !image[centerJ + i * qrcode.width] && stateCount[3] < maxCount;) stateCount[3]++, i++;
                            if (i == maxI || stateCount[3] >= maxCount) return NaN;
                            for (; i < maxI && image[centerJ + i * qrcode.width] && stateCount[4] < maxCount;) stateCount[4]++, i++;
                            if (stateCount[4] >= maxCount) return NaN;
                            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
                            return 5 * Math.abs(stateCountTotal - originalStateCountTotal) >= 2 * originalStateCountTotal ? NaN : this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, i) : NaN
                        }, this.crossCheckHorizontal = function(startJ, centerI, maxCount, originalStateCountTotal) {
                            for (var image = this.image, maxJ = qrcode.width, stateCount = this.CrossCheckStateCount, j = startJ; j >= 0 && image[j + centerI * qrcode.width];) stateCount[2]++, j--;
                            if (j < 0) return NaN;
                            for (; j >= 0 && !image[j + centerI * qrcode.width] && stateCount[1] <= maxCount;) stateCount[1]++, j--;
                            if (j < 0 || stateCount[1] > maxCount) return NaN;
                            for (; j >= 0 && image[j + centerI * qrcode.width] && stateCount[0] <= maxCount;) stateCount[0]++, j--;
                            if (stateCount[0] > maxCount) return NaN;
                            for (j = startJ + 1; j < maxJ && image[j + centerI * qrcode.width];) stateCount[2]++, j++;
                            if (j == maxJ) return NaN;
                            for (; j < maxJ && !image[j + centerI * qrcode.width] && stateCount[3] < maxCount;) stateCount[3]++, j++;
                            if (j == maxJ || stateCount[3] >= maxCount) return NaN;
                            for (; j < maxJ && image[j + centerI * qrcode.width] && stateCount[4] < maxCount;) stateCount[4]++, j++;
                            if (stateCount[4] >= maxCount) return NaN;
                            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
                            return 5 * Math.abs(stateCountTotal - originalStateCountTotal) >= originalStateCountTotal ? NaN : this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, j) : NaN
                        }, this.handlePossibleCenter = function(stateCount, i, j) {
                            var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4],
                                centerJ = this.centerFromEnd(stateCount, j),
                                centerI = this.crossCheckVertical(i, Math.floor(centerJ), stateCount[2], stateCountTotal);
                            if (!isNaN(centerI) && (centerJ = this.crossCheckHorizontal(Math.floor(centerJ), Math.floor(centerI), stateCount[2], stateCountTotal), !isNaN(centerJ))) {
                                for (var estimatedModuleSize = stateCountTotal / 7, found = !1, max = this.possibleCenters.length, index = 0; index < max; index++) {
                                    var center = this.possibleCenters[index];
                                    if (center.aboutEquals(estimatedModuleSize, centerI, centerJ)) {
                                        center.incrementCount(), found = !0;
                                        break
                                    }
                                }
                                if (!found) {
                                    var point = new function(posX, posY, estimatedModuleSize) {
                                        this.x = posX, this.y = posY, this.count = 1, this.estimatedModuleSize = estimatedModuleSize, this.__defineGetter__("EstimatedModuleSize", function() {
                                            return this.estimatedModuleSize
                                        }), this.__defineGetter__("Count", function() {
                                            return this.count
                                        }), this.__defineGetter__("X", function() {
                                            return this.x
                                        }), this.__defineGetter__("Y", function() {
                                            return this.y
                                        }), this.incrementCount = function() {
                                            this.count++
                                        }, this.aboutEquals = function(moduleSize, i, j) {
                                            if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize) {
                                                var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
                                                return moduleSizeDiff <= 1 || moduleSizeDiff / this.estimatedModuleSize <= 1
                                            }
                                            return !1
                                        }
                                    }(centerJ, centerI, estimatedModuleSize);
                                    this.possibleCenters.push(point), null != this.resultPointCallback && this.resultPointCallback.foundPossibleResultPoint(point)
                                }
                                return !0
                            }
                            return !1
                        }, this.selectBestPatterns = function() {
                            var startSize = this.possibleCenters.length;
                            if (startSize < 3) throw "没有找到足够的识别图形 (找到了 " + startSize + "个)";
                            if (startSize > 3) {
                                for (var totalModuleSize = 0, square = 0, i = 0; i < startSize; i++) {
                                    var centerValue = this.possibleCenters[i].EstimatedModuleSize;
                                    totalModuleSize += centerValue, square += centerValue * centerValue
                                }
                                var average = totalModuleSize / startSize;
                                this.possibleCenters.sort(function(center1, center2) {
                                    var dA = Math.abs(center2.EstimatedModuleSize - average),
                                        dB = Math.abs(center1.EstimatedModuleSize - average);
                                    return dA < dB ? -1 : dA == dB ? 0 : 1
                                });
                                for (var stdDev = Math.sqrt(square / startSize - average * average), limit = Math.max(.2 * average, stdDev), i = this.possibleCenters.length - 1; i >= 0; i--) {
                                    var pattern = this.possibleCenters[i];
                                    Math.abs(pattern.EstimatedModuleSize - average) > limit && this.possibleCenters.splice(i, 1)
                                }
                            }
                            return this.possibleCenters.length > 3 && this.possibleCenters.sort(function(a, b) {
                                return a.count > b.count ? -1 : a.count < b.count ? 1 : 0
                            }), new Array(this.possibleCenters[0], this.possibleCenters[1], this.possibleCenters[2])
                        }, this.findRowSkip = function() {
                            var max = this.possibleCenters.length;
                            if (max <= 1) return 0;
                            for (var firstConfirmedCenter = null, i = 0; i < max; i++) {
                                var center = this.possibleCenters[i];
                                if (center.Count >= CENTER_QUORUM) {
                                    if (null != firstConfirmedCenter) return this.hasSkipped = !0, Math.floor((Math.abs(firstConfirmedCenter.X - center.X) - Math.abs(firstConfirmedCenter.Y - center.Y)) / 2);
                                    firstConfirmedCenter = center
                                }
                            }
                            return 0
                        }, this.haveMultiplyConfirmedCenters = function() {
                            for (var confirmedCount = 0, totalModuleSize = 0, max = this.possibleCenters.length, i = 0; i < max; i++) {
                                var pattern = this.possibleCenters[i];
                                pattern.Count >= CENTER_QUORUM && (confirmedCount++, totalModuleSize += pattern.EstimatedModuleSize)
                            }
                            if (confirmedCount < 3) return !1;
                            for (var average = totalModuleSize / max, totalDeviation = 0, i = 0; i < max; i++) pattern = this.possibleCenters[i], totalDeviation += Math.abs(pattern.EstimatedModuleSize - average);
                            return totalDeviation <= .05 * totalModuleSize
                        }, this.findFinderPattern = function(image) {
                            this.image = image;
                            var maxI = qrcode.height,
                                maxJ = qrcode.width,
                                iSkip = Math.floor(3 * maxI / (4 * MAX_MODULES));
                            iSkip < MIN_SKIP && (iSkip = MIN_SKIP);
                            for (var done = !1, stateCount = new Array(5), i = iSkip - 1; i < maxI && !done; i += iSkip) {
                                stateCount[0] = 0, stateCount[1] = 0, stateCount[2] = 0, stateCount[3] = 0, stateCount[4] = 0;
                                for (var currentState = 0, j = 0; j < maxJ; j++)
                                    if (image[j + i * qrcode.width]) 1 == (1 & currentState) && currentState++, stateCount[currentState]++;
                                    else if (0 == (1 & currentState))
                                    if (4 == currentState)
                                        if (this.foundPatternCross(stateCount)) {
                                            var confirmed = this.handlePossibleCenter(stateCount, i, j);
                                            if (confirmed)
                                                if (iSkip = 2, this.hasSkipped) done = this.haveMultiplyConfirmedCenters();
                                                else {
                                                    var rowSkip = this.findRowSkip();
                                                    rowSkip > stateCount[2] && (i += rowSkip - stateCount[2] - iSkip, j = maxJ - 1)
                                                }
                                            else {
                                                do {
                                                    j++
                                                } while (j < maxJ && !image[j + i * qrcode.width]);
                                                j--
                                            }
                                            currentState = 0, stateCount[0] = 0, stateCount[1] = 0, stateCount[2] = 0, stateCount[3] = 0, stateCount[4] = 0
                                        } else stateCount[0] = stateCount[2], stateCount[1] = stateCount[3], stateCount[2] = stateCount[4], stateCount[3] = 1, stateCount[4] = 0, currentState = 3;
                                else stateCount[++currentState]++;
                                else stateCount[currentState]++;
                                if (this.foundPatternCross(stateCount)) {
                                    var confirmed = this.handlePossibleCenter(stateCount, i, maxJ);
                                    confirmed && (iSkip = stateCount[0], this.hasSkipped && (done = this.haveMultiplyConfirmedCenters()))
                                }
                            }
                            var patternInfo = this.selectBestPatterns();
                            return qrcode.orderBestPatterns(patternInfo), new function(patternCenters) {
                                this.bottomLeft = patternCenters[0], this.topLeft = patternCenters[1], this.topRight = patternCenters[2], this.__defineGetter__("BottomLeft", function() {
                                    return this.bottomLeft
                                }), this.__defineGetter__("TopLeft", function() {
                                    return this.topLeft
                                }), this.__defineGetter__("TopRight", function() {
                                    return this.topRight
                                })
                            }(patternInfo)
                        }
                    }).findFinderPattern(this.image);
                    return this.processFinderPatternInfo(info)
                }
            }
            GridSampler.checkAndNudgePoints = function(image, points) {
                for (var width = qrcode.width, height = qrcode.height, nudged = !0, offset = 0; offset < points.length && nudged; offset += 2) {
                    var x = Math.floor(points[offset]),
                        y = Math.floor(points[offset + 1]);
                    if (x < -1 || x > width || y < -1 || y > height) throw "校验错误 (Error.checkAndNudgePoints) ";
                    nudged = !1, -1 == x ? (points[offset] = 0, nudged = !0) : x == width && (points[offset] = width - 1, nudged = !0), -1 == y ? (points[offset + 1] = 0, nudged = !0) : y == height && (points[offset + 1] = height - 1, nudged = !0)
                }
                for (nudged = !0, offset = points.length - 2; offset >= 0 && nudged; offset -= 2) {
                    if (x = Math.floor(points[offset]), y = Math.floor(points[offset + 1]), x < -1 || x > width || y < -1 || y > height) throw "校验错误 (Error.checkAndNudgePoints) ";
                    nudged = !1, -1 == x ? (points[offset] = 0, nudged = !0) : x == width && (points[offset] = width - 1, nudged = !0), -1 == y ? (points[offset + 1] = 0, nudged = !0) : y == height && (points[offset + 1] = height - 1, nudged = !0)
                }
            }, GridSampler.sampleGrid3 = function(image, dimension, transform) {
                for (var bits = new BitMatrix(dimension), points = new Array(dimension << 1), y = 0; y < dimension; y++) {
                    for (var max = points.length, iValue = y + .5, x = 0; x < max; x += 2) points[x] = .5 + (x >> 1), points[x + 1] = iValue;
                    transform.transformPoints1(points), GridSampler.checkAndNudgePoints(image, points);
                    try {
                        for (x = 0; x < max; x += 2) image[Math.floor(points[x]) + qrcode.width * Math.floor(points[x + 1])] && bits.set_Renamed(x >> 1, y)
                    } catch (aioobe) {
                        throw "校验错误 (Error.checkAndNudgePoints) "
                    }
                }
                return bits
            }, GridSampler.sampleGridx = function(image, dimension, p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY) {
                var transform = PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY);
                return GridSampler.sampleGrid3(image, dimension, transform)
            }, Version.VERSION_DECODE_INFO = new Array(31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472, 70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507, 110734, 117786, 119615, 126325, 127568, 133589, 136944, 141498, 145311, 150283, 152622, 158308, 161089, 167017), Version.VERSIONS = new Array(new Version(1, new Array, new ECBlocks(7, new ECB(1, 19)), new ECBlocks(10, new ECB(1, 16)), new ECBlocks(13, new ECB(1, 13)), new ECBlocks(17, new ECB(1, 9))), new Version(2, new Array(6, 18), new ECBlocks(10, new ECB(1, 34)), new ECBlocks(16, new ECB(1, 28)), new ECBlocks(22, new ECB(1, 22)), new ECBlocks(28, new ECB(1, 16))), new Version(3, new Array(6, 22), new ECBlocks(15, new ECB(1, 55)), new ECBlocks(26, new ECB(1, 44)), new ECBlocks(18, new ECB(2, 17)), new ECBlocks(22, new ECB(2, 13))), new Version(4, new Array(6, 26), new ECBlocks(20, new ECB(1, 80)), new ECBlocks(18, new ECB(2, 32)), new ECBlocks(26, new ECB(2, 24)), new ECBlocks(16, new ECB(4, 9))), new Version(5, new Array(6, 30), new ECBlocks(26, new ECB(1, 108)), new ECBlocks(24, new ECB(2, 43)), new ECBlocks(18, new ECB(2, 15), new ECB(2, 16)), new ECBlocks(22, new ECB(2, 11), new ECB(2, 12))), new Version(6, new Array(6, 34), new ECBlocks(18, new ECB(2, 68)), new ECBlocks(16, new ECB(4, 27)), new ECBlocks(24, new ECB(4, 19)), new ECBlocks(28, new ECB(4, 15))), new Version(7, new Array(6, 22, 38), new ECBlocks(20, new ECB(2, 78)), new ECBlocks(18, new ECB(4, 31)), new ECBlocks(18, new ECB(2, 14), new ECB(4, 15)), new ECBlocks(26, new ECB(4, 13), new ECB(1, 14))), new Version(8, new Array(6, 24, 42), new ECBlocks(24, new ECB(2, 97)), new ECBlocks(22, new ECB(2, 38), new ECB(2, 39)), new ECBlocks(22, new ECB(4, 18), new ECB(2, 19)), new ECBlocks(26, new ECB(4, 14), new ECB(2, 15))), new Version(9, new Array(6, 26, 46), new ECBlocks(30, new ECB(2, 116)), new ECBlocks(22, new ECB(3, 36), new ECB(2, 37)), new ECBlocks(20, new ECB(4, 16), new ECB(4, 17)), new ECBlocks(24, new ECB(4, 12), new ECB(4, 13))), new Version(10, new Array(6, 28, 50), new ECBlocks(18, new ECB(2, 68), new ECB(2, 69)), new ECBlocks(26, new ECB(4, 43), new ECB(1, 44)), new ECBlocks(24, new ECB(6, 19), new ECB(2, 20)), new ECBlocks(28, new ECB(6, 15), new ECB(2, 16))), new Version(11, new Array(6, 30, 54), new ECBlocks(20, new ECB(4, 81)), new ECBlocks(30, new ECB(1, 50), new ECB(4, 51)), new ECBlocks(28, new ECB(4, 22), new ECB(4, 23)), new ECBlocks(24, new ECB(3, 12), new ECB(8, 13))), new Version(12, new Array(6, 32, 58), new ECBlocks(24, new ECB(2, 92), new ECB(2, 93)), new ECBlocks(22, new ECB(6, 36), new ECB(2, 37)), new ECBlocks(26, new ECB(4, 20), new ECB(6, 21)), new ECBlocks(28, new ECB(7, 14), new ECB(4, 15))), new Version(13, new Array(6, 34, 62), new ECBlocks(26, new ECB(4, 107)), new ECBlocks(22, new ECB(8, 37), new ECB(1, 38)), new ECBlocks(24, new ECB(8, 20), new ECB(4, 21)), new ECBlocks(22, new ECB(12, 11), new ECB(4, 12))), new Version(14, new Array(6, 26, 46, 66), new ECBlocks(30, new ECB(3, 115), new ECB(1, 116)), new ECBlocks(24, new ECB(4, 40), new ECB(5, 41)), new ECBlocks(20, new ECB(11, 16), new ECB(5, 17)), new ECBlocks(24, new ECB(11, 12), new ECB(5, 13))), new Version(15, new Array(6, 26, 48, 70), new ECBlocks(22, new ECB(5, 87), new ECB(1, 88)), new ECBlocks(24, new ECB(5, 41), new ECB(5, 42)), new ECBlocks(30, new ECB(5, 24), new ECB(7, 25)), new ECBlocks(24, new ECB(11, 12), new ECB(7, 13))), new Version(16, new Array(6, 26, 50, 74), new ECBlocks(24, new ECB(5, 98), new ECB(1, 99)), new ECBlocks(28, new ECB(7, 45), new ECB(3, 46)), new ECBlocks(24, new ECB(15, 19), new ECB(2, 20)), new ECBlocks(30, new ECB(3, 15), new ECB(13, 16))), new Version(17, new Array(6, 30, 54, 78), new ECBlocks(28, new ECB(1, 107), new ECB(5, 108)), new ECBlocks(28, new ECB(10, 46), new ECB(1, 47)), new ECBlocks(28, new ECB(1, 22), new ECB(15, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(17, 15))), new Version(18, new Array(6, 30, 56, 82), new ECBlocks(30, new ECB(5, 120), new ECB(1, 121)), new ECBlocks(26, new ECB(9, 43), new ECB(4, 44)), new ECBlocks(28, new ECB(17, 22), new ECB(1, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(19, 15))), new Version(19, new Array(6, 30, 58, 86), new ECBlocks(28, new ECB(3, 113), new ECB(4, 114)), new ECBlocks(26, new ECB(3, 44), new ECB(11, 45)), new ECBlocks(26, new ECB(17, 21), new ECB(4, 22)), new ECBlocks(26, new ECB(9, 13), new ECB(16, 14))), new Version(20, new Array(6, 34, 62, 90), new ECBlocks(28, new ECB(3, 107), new ECB(5, 108)), new ECBlocks(26, new ECB(3, 41), new ECB(13, 42)), new ECBlocks(30, new ECB(15, 24), new ECB(5, 25)), new ECBlocks(28, new ECB(15, 15), new ECB(10, 16))), new Version(21, new Array(6, 28, 50, 72, 94), new ECBlocks(28, new ECB(4, 116), new ECB(4, 117)), new ECBlocks(26, new ECB(17, 42)), new ECBlocks(28, new ECB(17, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(19, 16), new ECB(6, 17))), new Version(22, new Array(6, 26, 50, 74, 98), new ECBlocks(28, new ECB(2, 111), new ECB(7, 112)), new ECBlocks(28, new ECB(17, 46)), new ECBlocks(30, new ECB(7, 24), new ECB(16, 25)), new ECBlocks(24, new ECB(34, 13))), new Version(23, new Array(6, 30, 54, 74, 102), new ECBlocks(30, new ECB(4, 121), new ECB(5, 122)), new ECBlocks(28, new ECB(4, 47), new ECB(14, 48)), new ECBlocks(30, new ECB(11, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(16, 15), new ECB(14, 16))), new Version(24, new Array(6, 28, 54, 80, 106), new ECBlocks(30, new ECB(6, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(6, 45), new ECB(14, 46)), new ECBlocks(30, new ECB(11, 24), new ECB(16, 25)), new ECBlocks(30, new ECB(30, 16), new ECB(2, 17))), new Version(25, new Array(6, 32, 58, 84, 110), new ECBlocks(26, new ECB(8, 106), new ECB(4, 107)), new ECBlocks(28, new ECB(8, 47), new ECB(13, 48)), new ECBlocks(30, new ECB(7, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(13, 16))), new Version(26, new Array(6, 30, 58, 86, 114), new ECBlocks(28, new ECB(10, 114), new ECB(2, 115)), new ECBlocks(28, new ECB(19, 46), new ECB(4, 47)), new ECBlocks(28, new ECB(28, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(33, 16), new ECB(4, 17))), new Version(27, new Array(6, 34, 62, 90, 118), new ECBlocks(30, new ECB(8, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(22, 45), new ECB(3, 46)), new ECBlocks(30, new ECB(8, 23), new ECB(26, 24)), new ECBlocks(30, new ECB(12, 15), new ECB(28, 16))), new Version(28, new Array(6, 26, 50, 74, 98, 122), new ECBlocks(30, new ECB(3, 117), new ECB(10, 118)), new ECBlocks(28, new ECB(3, 45), new ECB(23, 46)), new ECBlocks(30, new ECB(4, 24), new ECB(31, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(31, 16))), new Version(29, new Array(6, 30, 54, 78, 102, 126), new ECBlocks(30, new ECB(7, 116), new ECB(7, 117)), new ECBlocks(28, new ECB(21, 45), new ECB(7, 46)), new ECBlocks(30, new ECB(1, 23), new ECB(37, 24)), new ECBlocks(30, new ECB(19, 15), new ECB(26, 16))), new Version(30, new Array(6, 26, 52, 78, 104, 130), new ECBlocks(30, new ECB(5, 115), new ECB(10, 116)), new ECBlocks(28, new ECB(19, 47), new ECB(10, 48)), new ECBlocks(30, new ECB(15, 24), new ECB(25, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(25, 16))), new Version(31, new Array(6, 30, 56, 82, 108, 134), new ECBlocks(30, new ECB(13, 115), new ECB(3, 116)), new ECBlocks(28, new ECB(2, 46), new ECB(29, 47)), new ECBlocks(30, new ECB(42, 24), new ECB(1, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(28, 16))), new Version(32, new Array(6, 34, 60, 86, 112, 138), new ECBlocks(30, new ECB(17, 115)), new ECBlocks(28, new ECB(10, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(10, 24), new ECB(35, 25)), new ECBlocks(30, new ECB(19, 15), new ECB(35, 16))), new Version(33, new Array(6, 30, 58, 86, 114, 142), new ECBlocks(30, new ECB(17, 115), new ECB(1, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(21, 47)), new ECBlocks(30, new ECB(29, 24), new ECB(19, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(46, 16))), new Version(34, new Array(6, 34, 62, 90, 118, 146), new ECBlocks(30, new ECB(13, 115), new ECB(6, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(44, 24), new ECB(7, 25)), new ECBlocks(30, new ECB(59, 16), new ECB(1, 17))), new Version(35, new Array(6, 30, 54, 78, 102, 126, 150), new ECBlocks(30, new ECB(12, 121), new ECB(7, 122)), new ECBlocks(28, new ECB(12, 47), new ECB(26, 48)), new ECBlocks(30, new ECB(39, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(41, 16))), new Version(36, new Array(6, 24, 50, 76, 102, 128, 154), new ECBlocks(30, new ECB(6, 121), new ECB(14, 122)), new ECBlocks(28, new ECB(6, 47), new ECB(34, 48)), new ECBlocks(30, new ECB(46, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(2, 15), new ECB(64, 16))), new Version(37, new Array(6, 28, 54, 80, 106, 132, 158), new ECBlocks(30, new ECB(17, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(29, 46), new ECB(14, 47)), new ECBlocks(30, new ECB(49, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(24, 15), new ECB(46, 16))), new Version(38, new Array(6, 32, 58, 84, 110, 136, 162), new ECBlocks(30, new ECB(4, 122), new ECB(18, 123)), new ECBlocks(28, new ECB(13, 46), new ECB(32, 47)), new ECBlocks(30, new ECB(48, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(42, 15), new ECB(32, 16))), new Version(39, new Array(6, 26, 54, 82, 110, 138, 166), new ECBlocks(30, new ECB(20, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(40, 47), new ECB(7, 48)), new ECBlocks(30, new ECB(43, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(10, 15), new ECB(67, 16))), new Version(40, new Array(6, 30, 58, 86, 114, 142, 170), new ECBlocks(30, new ECB(19, 118), new ECB(6, 119)), new ECBlocks(28, new ECB(18, 47), new ECB(31, 48)), new ECBlocks(30, new ECB(34, 24), new ECB(34, 25)), new ECBlocks(30, new ECB(20, 15), new ECB(61, 16)))), Version.getVersionForNumber = function(versionNumber) {
                if (versionNumber < 1 || versionNumber > 40) throw "版本错误";
                return Version.VERSIONS[versionNumber - 1]
            }, Version.getProvisionalVersionForDimension = function(dimension) {
                if (dimension % 4 != 1) throw "版本不匹配 (Error getProvisionalVersionForDimension)";
                try {
                    return Version.getVersionForNumber(dimension - 17 >> 2)
                } catch (iae) {
                    throw "版本不匹配 (Error getVersionForNumber)"
                }
            }, Version.decodeVersionInformation = function(versionBits) {
                for (var bestDifference = 4294967295, bestVersion = 0, i = 0; i < Version.VERSION_DECODE_INFO.length; i++) {
                    var targetVersion = Version.VERSION_DECODE_INFO[i];
                    if (targetVersion == versionBits) return this.getVersionForNumber(i + 7);
                    var bitsDifference = FormatInformation.numBitsDiffering(versionBits, targetVersion);
                    bitsDifference < bestDifference && (bestVersion = i + 7, bestDifference = bitsDifference)
                }
                return bestDifference <= 3 ? this.getVersionForNumber(bestVersion) : null
            }, PerspectiveTransform.quadrilateralToQuadrilateral = function(x0, y0, x1, y1, x2, y2, x3, y3, x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p) {
                var qToS = this.quadrilateralToSquare(x0, y0, x1, y1, x2, y2, x3, y3);
                return this.squareToQuadrilateral(x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p).times(qToS)
            }, PerspectiveTransform.squareToQuadrilateral = function(x0, y0, x1, y1, x2, y2, x3, y3) {
                var dy2 = y3 - y2,
                    dy3 = y0 - y1 + y2 - y3;
                if (0 == dy2 && 0 == dy3) return new PerspectiveTransform(x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0, 0, 1);
                var dx1 = x1 - x2,
                    dx2 = x3 - x2,
                    dx3 = x0 - x1 + x2 - x3,
                    dy1 = y1 - y2,
                    denominator = dx1 * dy2 - dx2 * dy1,
                    a13 = (dx3 * dy2 - dx2 * dy3) / denominator,
                    a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
                return new PerspectiveTransform(x1 - x0 + a13 * x1, x3 - x0 + a23 * x3, x0, y1 - y0 + a13 * y1, y3 - y0 + a23 * y3, y0, a13, a23, 1)
            }, PerspectiveTransform.quadrilateralToSquare = function(x0, y0, x1, y1, x2, y2, x3, y3) {
                return this.squareToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3).buildAdjoint()
            };
            var FORMAT_INFO_DECODE_LOOKUP = new Array(new Array(21522, 0), new Array(20773, 1), new Array(24188, 2), new Array(23371, 3), new Array(17913, 4), new Array(16590, 5), new Array(20375, 6), new Array(19104, 7), new Array(30660, 8), new Array(29427, 9), new Array(32170, 10), new Array(30877, 11), new Array(26159, 12), new Array(25368, 13), new Array(27713, 14), new Array(26998, 15), new Array(5769, 16), new Array(5054, 17), new Array(7399, 18), new Array(6608, 19), new Array(1890, 20), new Array(597, 21), new Array(3340, 22), new Array(2107, 23), new Array(13663, 24), new Array(12392, 25), new Array(16177, 26), new Array(14854, 27), new Array(9396, 28), new Array(8579, 29), new Array(11994, 30), new Array(11245, 31)),
                BITS_SET_IN_HALF_BYTE = new Array(0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4);

            function FormatInformation(formatInfo) {
                this.errorCorrectionLevel = ErrorCorrectionLevel.forBits(formatInfo >> 3 & 3), this.dataMask = 7 & formatInfo, this.__defineGetter__("ErrorCorrectionLevel", function() {
                    return this.errorCorrectionLevel
                }), this.__defineGetter__("DataMask", function() {
                    return this.dataMask
                }), this.GetHashCode = function() {
                    return this.errorCorrectionLevel.ordinal() << 3 | this.dataMask
                }, this.Equals = function(o) {
                    var other = o;
                    return this.errorCorrectionLevel == other.errorCorrectionLevel && this.dataMask == other.dataMask
                }
            }

            function ErrorCorrectionLevel(ordinal, bits, name) {
                this.ordinal_Renamed_Field = ordinal, this.bits = bits, this.name = name, this.__defineGetter__("Bits", function() {
                    return this.bits
                }), this.__defineGetter__("Name", function() {
                    return this.name
                }), this.ordinal = function() {
                    return this.ordinal_Renamed_Field
                }
            }
            FormatInformation.numBitsDiffering = function(a, b) {
                return BITS_SET_IN_HALF_BYTE[15 & (a ^= b)] + BITS_SET_IN_HALF_BYTE[15 & URShift(a, 4)] + BITS_SET_IN_HALF_BYTE[15 & URShift(a, 8)] + BITS_SET_IN_HALF_BYTE[15 & URShift(a, 12)] + BITS_SET_IN_HALF_BYTE[15 & URShift(a, 16)] + BITS_SET_IN_HALF_BYTE[15 & URShift(a, 20)] + BITS_SET_IN_HALF_BYTE[15 & URShift(a, 24)] + BITS_SET_IN_HALF_BYTE[15 & URShift(a, 28)]
            }, FormatInformation.decodeFormatInformation = function(maskedFormatInfo) {
                var formatInfo = FormatInformation.doDecodeFormatInformation(maskedFormatInfo);
                return null != formatInfo ? formatInfo : FormatInformation.doDecodeFormatInformation(21522 ^ maskedFormatInfo)
            }, FormatInformation.doDecodeFormatInformation = function(maskedFormatInfo) {
                for (var bestDifference = 4294967295, bestFormatInfo = 0, i = 0; i < FORMAT_INFO_DECODE_LOOKUP.length; i++) {
                    var decodeInfo = FORMAT_INFO_DECODE_LOOKUP[i],
                        targetInfo = decodeInfo[0];
                    if (targetInfo == maskedFormatInfo) return new FormatInformation(decodeInfo[1]);
                    var bitsDifference = this.numBitsDiffering(maskedFormatInfo, targetInfo);
                    bitsDifference < bestDifference && (bestFormatInfo = decodeInfo[1], bestDifference = bitsDifference)
                }
                return bestDifference <= 3 ? new FormatInformation(bestFormatInfo) : null
            }, ErrorCorrectionLevel.forBits = function(bits) {
                if (bits < 0 || bits >= FOR_BITS.length) throw "ArgumentException";
                return FOR_BITS[bits]
            };
            var L = new ErrorCorrectionLevel(0, 1, "L"),
                M = new ErrorCorrectionLevel(1, 0, "M"),
                Q = new ErrorCorrectionLevel(2, 3, "Q"),
                H = new ErrorCorrectionLevel(3, 2, "H"),
                FOR_BITS = new Array(M, L, H, Q);

            function BitMatrix(width, height) {
                if (height || (height = width), width < 1 || height < 1) throw "Both dimensions must be greater than 0";
                this.width = width, this.height = height;
                var rowSize = width >> 5;
                0 != (31 & width) && rowSize++, this.rowSize = rowSize, this.bits = new Array(rowSize * height);
                for (var i = 0; i < this.bits.length; i++) this.bits[i] = 0;
                this.__defineGetter__("Width", function() {
                    return this.width
                }), this.__defineGetter__("Height", function() {
                    return this.height
                }), this.__defineGetter__("Dimension", function() {
                    if (this.width != this.height) throw "Can't call getDimension() on a non-square matrix";
                    return this.width
                }), this.get_Renamed = function(x, y) {
                    var offset = y * this.rowSize + (x >> 5);
                    return 0 != (1 & URShift(this.bits[offset], 31 & x))
                }, this.set_Renamed = function(x, y) {
                    var offset = y * this.rowSize + (x >> 5);
                    this.bits[offset] |= 1 << (31 & x)
                }, this.flip = function(x, y) {
                    var offset = y * this.rowSize + (x >> 5);
                    this.bits[offset] ^= 1 << (31 & x)
                }, this.clear = function() {
                    for (var max = this.bits.length, i = 0; i < max; i++) this.bits[i] = 0
                }, this.setRegion = function(left, top, width, height) {
                    if (top < 0 || left < 0) throw "位置不能为负";
                    if (height < 1 || width < 1) throw "图像过小";
                    var right = left + width,
                        bottom = top + height;
                    if (bottom > this.height || right > this.width) throw "显示不完全";
                    for (var y = top; y < bottom; y++)
                        for (var offset = y * this.rowSize, x = left; x < right; x++) this.bits[offset + (x >> 5)] |= 1 << (31 & x)
                }
            }

            function DataBlock(numDataCodewords, codewords) {
                this.numDataCodewords = numDataCodewords, this.codewords = codewords, this.__defineGetter__("NumDataCodewords", function() {
                    return this.numDataCodewords
                }), this.__defineGetter__("Codewords", function() {
                    return this.codewords
                })
            }
            DataBlock.getDataBlocks = function(rawCodewords, version, ecLevel) {
                if (rawCodewords.length != version.TotalCodewords) throw "ArgumentException";
                for (var ecBlocks = version.getECBlocksForLevel(ecLevel), totalBlocks = 0, ecBlockArray = ecBlocks.getECBlocks(), i = 0; i < ecBlockArray.length; i++) totalBlocks += ecBlockArray[i].Count;
                for (var result = new Array(totalBlocks), numResultBlocks = 0, j = 0; j < ecBlockArray.length; j++) {
                    var ecBlock = ecBlockArray[j];
                    for (i = 0; i < ecBlock.Count; i++) {
                        var numDataCodewords = ecBlock.DataCodewords,
                            numBlockCodewords = ecBlocks.ECCodewordsPerBlock + numDataCodewords;
                        result[numResultBlocks++] = new DataBlock(numDataCodewords, new Array(numBlockCodewords))
                    }
                }
                for (var shorterBlocksTotalCodewords = result[0].codewords.length, longerBlocksStartAt = result.length - 1; longerBlocksStartAt >= 0 && result[longerBlocksStartAt].codewords.length != shorterBlocksTotalCodewords;) longerBlocksStartAt--;
                longerBlocksStartAt++;
                var shorterBlocksNumDataCodewords = shorterBlocksTotalCodewords - ecBlocks.ECCodewordsPerBlock,
                    rawCodewordsOffset = 0;
                for (i = 0; i < shorterBlocksNumDataCodewords; i++)
                    for (j = 0; j < numResultBlocks; j++) result[j].codewords[i] = rawCodewords[rawCodewordsOffset++];
                for (j = longerBlocksStartAt; j < numResultBlocks; j++) result[j].codewords[shorterBlocksNumDataCodewords] = rawCodewords[rawCodewordsOffset++];
                var max = result[0].codewords.length;
                for (i = shorterBlocksNumDataCodewords; i < max; i++)
                    for (j = 0; j < numResultBlocks; j++) {
                        var iOffset = j < longerBlocksStartAt ? i : i + 1;
                        result[j].codewords[iOffset] = rawCodewords[rawCodewordsOffset++]
                    }
                return result
            };
            var DataMask = {};

            function GF256Poly(field, coefficients) {
                if (null == coefficients || 0 == coefficients.length) throw "System.ArgumentException";
                this.field = field;
                var coefficientsLength = coefficients.length;
                if (coefficientsLength > 1 && 0 == coefficients[0]) {
                    for (var firstNonZero = 1; firstNonZero < coefficientsLength && 0 == coefficients[firstNonZero];) firstNonZero++;
                    if (firstNonZero == coefficientsLength) this.coefficients = field.Zero.coefficients;
                    else {
                        this.coefficients = new Array(coefficientsLength - firstNonZero);
                        for (var i = 0; i < this.coefficients.length; i++) this.coefficients[i] = 0;
                        for (var ci = 0; ci < this.coefficients.length; ci++) this.coefficients[ci] = coefficients[firstNonZero + ci]
                    }
                } else this.coefficients = coefficients;
                this.__defineGetter__("Zero", function() {
                    return 0 == this.coefficients[0]
                }), this.__defineGetter__("Degree", function() {
                    return this.coefficients.length - 1
                }), this.__defineGetter__("Coefficients", function() {
                    return this.coefficients
                }), this.getCoefficient = function(degree) {
                    return this.coefficients[this.coefficients.length - 1 - degree]
                }, this.evaluateAt = function(a) {
                    if (0 == a) return this.getCoefficient(0);
                    var size = this.coefficients.length;
                    if (1 == a) {
                        for (var result = 0, i = 0; i < size; i++) result = GF256.addOrSubtract(result, this.coefficients[i]);
                        return result
                    }
                    var result2 = this.coefficients[0];
                    for (i = 1; i < size; i++) result2 = GF256.addOrSubtract(this.field.multiply(a, result2), this.coefficients[i]);
                    return result2
                }, this.addOrSubtract = function(other) {
                    if (this.field != other.field) throw "GF256Polys do not have same GF256 field";
                    if (this.Zero) return other;
                    if (other.Zero) return this;
                    var smallerCoefficients = this.coefficients,
                        largerCoefficients = other.coefficients;
                    if (smallerCoefficients.length > largerCoefficients.length) {
                        var temp = smallerCoefficients;
                        smallerCoefficients = largerCoefficients, largerCoefficients = temp
                    }
                    for (var sumDiff = new Array(largerCoefficients.length), lengthDiff = largerCoefficients.length - smallerCoefficients.length, ci = 0; ci < lengthDiff; ci++) sumDiff[ci] = largerCoefficients[ci];
                    for (var i = lengthDiff; i < largerCoefficients.length; i++) sumDiff[i] = GF256.addOrSubtract(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
                    return new GF256Poly(field, sumDiff)
                }, this.multiply1 = function(other) {
                    if (this.field != other.field) throw "GF256Polys do not have same GF256 field";
                    if (this.Zero || other.Zero) return this.field.Zero;
                    for (var aCoefficients = this.coefficients, aLength = aCoefficients.length, bCoefficients = other.coefficients, bLength = bCoefficients.length, product = new Array(aLength + bLength - 1), i = 0; i < aLength; i++)
                        for (var aCoeff = aCoefficients[i], j = 0; j < bLength; j++) product[i + j] = GF256.addOrSubtract(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
                    return new GF256Poly(this.field, product)
                }, this.multiply2 = function(scalar) {
                    if (0 == scalar) return this.field.Zero;
                    if (1 == scalar) return this;
                    for (var size = this.coefficients.length, product = new Array(size), i = 0; i < size; i++) product[i] = this.field.multiply(this.coefficients[i], scalar);
                    return new GF256Poly(this.field, product)
                }, this.multiplyByMonomial = function(degree, coefficient) {
                    if (degree < 0) throw "System.ArgumentException";
                    if (0 == coefficient) return this.field.Zero;
                    for (var size = this.coefficients.length, product = new Array(size + degree), i = 0; i < product.length; i++) product[i] = 0;
                    for (i = 0; i < size; i++) product[i] = this.field.multiply(this.coefficients[i], coefficient);
                    return new GF256Poly(this.field, product)
                }, this.divide = function(other) {
                    if (this.field != other.field) throw "GF256Polys do not have same GF256 field";
                    if (other.Zero) throw "Divide by 0";
                    for (var quotient = this.field.Zero, remainder = this, denominatorLeadingTerm = other.getCoefficient(other.Degree), inverseDenominatorLeadingTerm = this.field.inverse(denominatorLeadingTerm); remainder.Degree >= other.Degree && !remainder.Zero;) {
                        var degreeDifference = remainder.Degree - other.Degree,
                            scale = this.field.multiply(remainder.getCoefficient(remainder.Degree), inverseDenominatorLeadingTerm),
                            term = other.multiplyByMonomial(degreeDifference, scale),
                            iterationQuotient = this.field.buildMonomial(degreeDifference, scale);
                        quotient = quotient.addOrSubtract(iterationQuotient), remainder = remainder.addOrSubtract(term)
                    }
                    return new Array(quotient, remainder)
                }
            }

            function GF256(primitive) {
                this.expTable = new Array(256), this.logTable = new Array(256);
                for (var x = 1, i = 0; i < 256; i++) this.expTable[i] = x, (x <<= 1) >= 256 && (x ^= primitive);
                for (i = 0; i < 255; i++) this.logTable[this.expTable[i]] = i;
                var at0 = new Array(1);
                at0[0] = 0, this.zero = new GF256Poly(this, new Array(at0));
                var at1 = new Array(1);
                at1[0] = 1, this.one = new GF256Poly(this, new Array(at1)), this.__defineGetter__("Zero", function() {
                    return this.zero
                }), this.__defineGetter__("One", function() {
                    return this.one
                }), this.buildMonomial = function(degree, coefficient) {
                    if (degree < 0) throw "System.ArgumentException";
                    if (0 == coefficient) return this.zero;
                    for (var coefficients = new Array(degree + 1), i = 0; i < coefficients.length; i++) coefficients[i] = 0;
                    return coefficients[0] = coefficient, new GF256Poly(this, coefficients)
                }, this.exp = function(a) {
                    return this.expTable[a]
                }, this.log = function(a) {
                    if (0 == a) throw "System.ArgumentException";
                    return this.logTable[a]
                }, this.inverse = function(a) {
                    if (0 == a) throw "System.ArithmeticException";
                    return this.expTable[255 - this.logTable[a]]
                }, this.multiply = function(a, b) {
                    return 0 == a || 0 == b ? 0 : 1 == a ? b : 1 == b ? a : this.expTable[(this.logTable[a] + this.logTable[b]) % 255]
                }
            }
            DataMask.forReference = function(reference) {
                if (reference < 0 || reference > 7) throw "System.ArgumentException";
                return DataMask.DATA_MASKS[reference]
            }, DataMask.DATA_MASKS = new Array(new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    return 0 == (i + j & 1)
                }
            }, new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    return 0 == (1 & i)
                }
            }, new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    return j % 3 == 0
                }
            }, new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    return (i + j) % 3 == 0
                }
            }, new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    return 0 == (URShift(i, 1) + j / 3 & 1)
                }
            }, new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    var temp = i * j;
                    return (1 & temp) + temp % 3 == 0
                }
            }, new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    var temp = i * j;
                    return 0 == ((1 & temp) + temp % 3 & 1)
                }
            }, new function() {
                this.unmaskBitMatrix = function(bits, dimension) {
                    for (var i = 0; i < dimension; i++)
                        for (var j = 0; j < dimension; j++) this.isMasked(i, j) && bits.flip(j, i)
                }, this.isMasked = function(i, j) {
                    return 0 == ((i + j & 1) + i * j % 3 & 1)
                }
            }), GF256.QR_CODE_FIELD = new GF256(285), GF256.DATA_MATRIX_FIELD = new GF256(301), GF256.addOrSubtract = function(a, b) {
                return a ^ b
            };
            var Decoder = {};
            Decoder.rsDecoder = new function(field) {
                this.field = field, this.decode = function(received, twoS) {
                    for (var poly = new GF256Poly(this.field, received), syndromeCoefficients = new Array(twoS), i = 0; i < syndromeCoefficients.length; i++) syndromeCoefficients[i] = 0;
                    var noError = !0;
                    for (i = 0; i < twoS; i++) {
                        var evalu = poly.evaluateAt(this.field.exp(i));
                        syndromeCoefficients[syndromeCoefficients.length - 1 - i] = evalu, 0 != evalu && (noError = !1)
                    }
                    if (!noError) {
                        var syndrome = new GF256Poly(this.field, syndromeCoefficients),
                            sigmaOmega = this.runEuclideanAlgorithm(this.field.buildMonomial(twoS, 1), syndrome, twoS),
                            sigma = sigmaOmega[0],
                            omega = sigmaOmega[1],
                            errorLocations = this.findErrorLocations(sigma),
                            errorMagnitudes = this.findErrorMagnitudes(omega, errorLocations, !1);
                        for (i = 0; i < errorLocations.length; i++) {
                            var position = received.length - 1 - this.field.log(errorLocations[i]);
                            if (position < 0) throw "校验块位置错误";
                            received[position] = GF256.addOrSubtract(received[position], errorMagnitudes[i])
                        }
                    }
                }, this.runEuclideanAlgorithm = function(a, b, R) {
                    if (a.Degree < b.Degree) {
                        var temp = a;
                        a = b, b = temp
                    }
                    for (var rLast = a, r = b, sLast = this.field.One, s = this.field.Zero, tLast = this.field.Zero, t = this.field.One; r.Degree >= Math.floor(R / 2);) {
                        var rLastLast = rLast,
                            sLastLast = sLast,
                            tLastLast = tLast;
                        if (sLast = s, tLast = t, (rLast = r).Zero) throw "r_{i-1} was zero";
                        r = rLastLast;
                        for (var q = this.field.Zero, denominatorLeadingTerm = rLast.getCoefficient(rLast.Degree), dltInverse = this.field.inverse(denominatorLeadingTerm); r.Degree >= rLast.Degree && !r.Zero;) {
                            var degreeDiff = r.Degree - rLast.Degree,
                                scale = this.field.multiply(r.getCoefficient(r.Degree), dltInverse);
                            q = q.addOrSubtract(this.field.buildMonomial(degreeDiff, scale)), r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale))
                        }
                        s = q.multiply1(sLast).addOrSubtract(sLastLast), t = q.multiply1(tLast).addOrSubtract(tLastLast)
                    }
                    var sigmaTildeAtZero = t.getCoefficient(0);
                    if (0 == sigmaTildeAtZero) throw "ReedSolomonException sigmaTilde(0) was zero";
                    var inverse = this.field.inverse(sigmaTildeAtZero),
                        sigma = t.multiply2(inverse),
                        omega = r.multiply2(inverse);
                    return new Array(sigma, omega)
                }, this.findErrorLocations = function(errorLocator) {
                    var numErrors = errorLocator.Degree;
                    if (1 == numErrors) return new Array(errorLocator.getCoefficient(1));
                    for (var result = new Array(numErrors), e = 0, i = 1; i < 256 && e < numErrors; i++) 0 == errorLocator.evaluateAt(i) && (result[e] = this.field.inverse(i), e++);
                    if (e != numErrors) throw "Error locator degree does not match number of roots";
                    return result
                }, this.findErrorMagnitudes = function(errorEvaluator, errorLocations, dataMatrix) {
                    for (var s = errorLocations.length, result = new Array(s), i = 0; i < s; i++) {
                        for (var xiInverse = this.field.inverse(errorLocations[i]), denominator = 1, j = 0; j < s; j++) i != j && (denominator = this.field.multiply(denominator, GF256.addOrSubtract(1, this.field.multiply(errorLocations[j], xiInverse))));
                        result[i] = this.field.multiply(errorEvaluator.evaluateAt(xiInverse), this.field.inverse(denominator)), dataMatrix && (result[i] = this.field.multiply(result[i], xiInverse))
                    }
                    return result
                }
            }(GF256.QR_CODE_FIELD), Decoder.correctErrors = function(codewordBytes, numDataCodewords) {
                for (var numCodewords = codewordBytes.length, codewordsInts = new Array(numCodewords), i = 0; i < numCodewords; i++) codewordsInts[i] = 255 & codewordBytes[i];
                var numECCodewords = codewordBytes.length - numDataCodewords;
                try {
                    Decoder.rsDecoder.decode(codewordsInts, numECCodewords)
                } catch (rse) {
                    throw rse
                }
                for (i = 0; i < numDataCodewords; i++) codewordBytes[i] = codewordsInts[i]
            }, Decoder.decode = function(bits) {
                for (var parser = new function(bitMatrix) {
                        var dimension = bitMatrix.Dimension;
                        if (dimension < 21 || 1 != (3 & dimension)) throw "Error BitMatrixParser";
                        this.bitMatrix = bitMatrix, this.parsedVersion = null, this.parsedFormatInfo = null, this.copyBit = function(i, j, versionBits) {
                            return this.bitMatrix.get_Renamed(i, j) ? versionBits << 1 | 1 : versionBits << 1
                        }, this.readFormatInformation = function() {
                            if (null != this.parsedFormatInfo) return this.parsedFormatInfo;
                            for (var formatInfoBits = 0, i = 0; i < 6; i++) formatInfoBits = this.copyBit(i, 8, formatInfoBits);
                            formatInfoBits = this.copyBit(7, 8, formatInfoBits), formatInfoBits = this.copyBit(8, 8, formatInfoBits), formatInfoBits = this.copyBit(8, 7, formatInfoBits);
                            for (var j = 5; j >= 0; j--) formatInfoBits = this.copyBit(8, j, formatInfoBits);
                            if (this.parsedFormatInfo = FormatInformation.decodeFormatInformation(formatInfoBits), null != this.parsedFormatInfo) return this.parsedFormatInfo;
                            var dimension = this.bitMatrix.Dimension;
                            formatInfoBits = 0;
                            var iMin = dimension - 8;
                            for (i = dimension - 1; i >= iMin; i--) formatInfoBits = this.copyBit(i, 8, formatInfoBits);
                            for (j = dimension - 7; j < dimension; j++) formatInfoBits = this.copyBit(8, j, formatInfoBits);
                            if (this.parsedFormatInfo = FormatInformation.decodeFormatInformation(formatInfoBits), null != this.parsedFormatInfo) return this.parsedFormatInfo;
                            throw "读取格式信息错误"
                        }, this.readVersion = function() {
                            if (null != this.parsedVersion) return this.parsedVersion;
                            var dimension = this.bitMatrix.Dimension,
                                provisionalVersion = dimension - 17 >> 2;
                            if (provisionalVersion <= 6) return Version.getVersionForNumber(provisionalVersion);
                            for (var versionBits = 0, ijMin = dimension - 11, j = 5; j >= 0; j--)
                                for (var i = dimension - 9; i >= ijMin; i--) versionBits = this.copyBit(i, j, versionBits);
                            if (this.parsedVersion = Version.decodeVersionInformation(versionBits), null != this.parsedVersion && this.parsedVersion.DimensionForVersion == dimension) return this.parsedVersion;
                            for (versionBits = 0, i = 5; i >= 0; i--)
                                for (j = dimension - 9; j >= ijMin; j--) versionBits = this.copyBit(i, j, versionBits);
                            if (this.parsedVersion = Version.decodeVersionInformation(versionBits), null != this.parsedVersion && this.parsedVersion.DimensionForVersion == dimension) return this.parsedVersion;
                            throw "读取版本号错误"
                        }, this.readCodewords = function() {
                            var formatInfo = this.readFormatInformation(),
                                version = this.readVersion(),
                                dataMask = DataMask.forReference(formatInfo.DataMask),
                                dimension = this.bitMatrix.Dimension;
                            dataMask.unmaskBitMatrix(this.bitMatrix, dimension);
                            for (var functionPattern = version.buildFunctionPattern(), readingUp = !0, result = new Array(version.TotalCodewords), resultOffset = 0, currentByte = 0, bitsRead = 0, j = dimension - 1; j > 0; j -= 2) {
                                6 == j && j--;
                                for (var count = 0; count < dimension; count++)
                                    for (var i = readingUp ? dimension - 1 - count : count, col = 0; col < 2; col++) functionPattern.get_Renamed(j - col, i) || (bitsRead++, currentByte <<= 1, this.bitMatrix.get_Renamed(j - col, i) && (currentByte |= 1), 8 == bitsRead && (result[resultOffset++] = currentByte, bitsRead = 0, currentByte = 0));
                                readingUp ^= !0
                            }
                            if (resultOffset != version.TotalCodewords) throw "Error readCodewords";
                            return result
                        }
                    }(bits), version = parser.readVersion(), ecLevel = parser.readFormatInformation().ErrorCorrectionLevel, codewords = parser.readCodewords(), dataBlocks = DataBlock.getDataBlocks(codewords, version, ecLevel), totalBytes = 0, i = 0; i < dataBlocks.length; i++) totalBytes += dataBlocks[i].NumDataCodewords;
                for (var resultBytes = new Array(totalBytes), resultOffset = 0, j = 0; j < dataBlocks.length; j++) {
                    var dataBlock = dataBlocks[j],
                        codewordBytes = dataBlock.Codewords,
                        numDataCodewords = dataBlock.NumDataCodewords;
                    for (Decoder.correctErrors(codewordBytes, numDataCodewords), i = 0; i < numDataCodewords; i++) resultBytes[resultOffset++] = codewordBytes[i]
                }
                return new function(blocks, version, numErrorCorrectionCode) {
                    this.blockPointer = 0, this.bitPointer = 7, this.dataLength = 0, this.blocks = blocks, this.numErrorCorrectionCode = numErrorCorrectionCode, version <= 9 ? this.dataLengthMode = 0 : version >= 10 && version <= 26 ? this.dataLengthMode = 1 : version >= 27 && version <= 40 && (this.dataLengthMode = 2), this.getNextBits = function(numBits) {
                        var bits = 0;
                        if (numBits < this.bitPointer + 1) {
                            for (var mask = 0, i = 0; i < numBits; i++) mask += 1 << i;
                            return mask <<= this.bitPointer - numBits + 1, bits = (this.blocks[this.blockPointer] & mask) >> this.bitPointer - numBits + 1, this.bitPointer -= numBits, bits
                        }
                        if (numBits < this.bitPointer + 1 + 8) {
                            for (var mask1 = 0, i = 0; i < this.bitPointer + 1; i++) mask1 += 1 << i;
                            return bits = (this.blocks[this.blockPointer] & mask1) << numBits - (this.bitPointer + 1), this.blockPointer++, bits += this.blocks[this.blockPointer] >> 8 - (numBits - (this.bitPointer + 1)), this.bitPointer = this.bitPointer - numBits % 8, this.bitPointer < 0 && (this.bitPointer = 8 + this.bitPointer), bits
                        }
                        if (numBits < this.bitPointer + 1 + 16) {
                            for (var mask1 = 0, mask3 = 0, i = 0; i < this.bitPointer + 1; i++) mask1 += 1 << i;
                            var bitsFirstBlock = (this.blocks[this.blockPointer] & mask1) << numBits - (this.bitPointer + 1);
                            this.blockPointer++;
                            var bitsSecondBlock = this.blocks[this.blockPointer] << numBits - (this.bitPointer + 1 + 8);
                            this.blockPointer++;
                            for (var i = 0; i < numBits - (this.bitPointer + 1 + 8); i++) mask3 += 1 << i;
                            mask3 <<= 8 - (numBits - (this.bitPointer + 1 + 8));
                            var bitsThirdBlock = (this.blocks[this.blockPointer] & mask3) >> 8 - (numBits - (this.bitPointer + 1 + 8));
                            return bits = bitsFirstBlock + bitsSecondBlock + bitsThirdBlock, this.bitPointer = this.bitPointer - (numBits - 8) % 8, this.bitPointer < 0 && (this.bitPointer = 8 + this.bitPointer), bits
                        }
                        return 0
                    }, this.NextMode = function() {
                        return this.blockPointer > this.blocks.length - this.numErrorCorrectionCode - 2 ? 0 : this.getNextBits(4)
                    }, this.getDataLength = function(modeIndicator) {
                        for (var index = 0; modeIndicator >> index != 1;) index++;
                        return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][index])
                    }, this.getRomanAndFigureString = function(dataLength) {
                        var length = dataLength,
                            intData = 0,
                            strData = "",
                            tableRomanAndFigure = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":");
                        do {
                            if (length > 1) {
                                intData = this.getNextBits(11);
                                var firstLetter = Math.floor(intData / 45),
                                    secondLetter = intData % 45;
                                strData += tableRomanAndFigure[firstLetter], strData += tableRomanAndFigure[secondLetter], length -= 2
                            } else 1 == length && (intData = this.getNextBits(6), strData += tableRomanAndFigure[intData], length -= 1)
                        } while (length > 0);
                        return strData
                    }, this.getFigureString = function(dataLength) {
                        var length = dataLength,
                            intData = 0,
                            strData = "";
                        do {
                            length >= 3 ? ((intData = this.getNextBits(10)) < 100 && (strData += "0"), intData < 10 && (strData += "0"), length -= 3) : 2 == length ? ((intData = this.getNextBits(7)) < 10 && (strData += "0"), length -= 2) : 1 == length && (intData = this.getNextBits(4), length -= 1), strData += intData
                        } while (length > 0);
                        return strData
                    }, this.get8bitByteArray = function(dataLength) {
                        var length = dataLength,
                            intData = 0,
                            output = new Array;
                        do {
                            intData = this.getNextBits(8), output.push(intData), length--
                        } while (length > 0);
                        return output
                    }, this.getKanjiString = function(dataLength) {
                        var length = dataLength,
                            intData = 0,
                            unicodeString = "";
                        do {
                            var lowerByte = (intData = this.getNextBits(13)) % 192,
                                higherByte = intData / 192,
                                tempWord = (higherByte << 8) + lowerByte,
                                shiftjisWord = 0;
                            shiftjisWord = tempWord + 33088 <= 40956 ? tempWord + 33088 : tempWord + 49472, unicodeString += String.fromCharCode(shiftjisWord), length--
                        } while (length > 0);
                        return unicodeString
                    }, this.parseECIValue = function() {
                        var intData = 0,
                            firstByte = this.getNextBits(8);
                        if (0 == (128 & firstByte) && (intData = 127 & firstByte), 128 == (192 & firstByte)) {
                            var secondByte = this.getNextBits(8);
                            intData = (63 & firstByte) << 8 | secondByte
                        }
                        if (192 == (224 & firstByte)) {
                            var secondThirdBytes = this.getNextBits(8);
                            intData = (31 & firstByte) << 16 | secondThirdBytes
                        }
                        return intData
                    }, this.__defineGetter__("DataByte", function() {
                        for (var output = new Array;;) {
                            var mode = this.NextMode();
                            if (0 == mode) {
                                if (output.length > 0) break;
                                throw "数据块是空的"
                            }
                            if (1 != mode && 2 != mode && 4 != mode && 8 != mode && 7 != mode) throw "错误的编码模式: " + mode + " 位于 (块:" + this.blockPointer + " 位:" + this.bitPointer + ")";
                            if (7 == mode) var temp_sbyteArray3 = this.parseECIValue();
                            else {
                                var dataLength = this.getDataLength(mode);
                                if (dataLength < 1) throw "错误的数据长度: " + dataLength;
                                switch (mode) {
                                    case 1:
                                        for (var temp_str = this.getFigureString(dataLength), ta = new Array(temp_str.length), j = 0; j < temp_str.length; j++) ta[j] = temp_str.charCodeAt(j);
                                        output.push(ta);
                                        break;
                                    case 2:
                                        for (var temp_str = this.getRomanAndFigureString(dataLength), ta = new Array(temp_str.length), j = 0; j < temp_str.length; j++) ta[j] = temp_str.charCodeAt(j);
                                        output.push(ta);
                                        break;
                                    case 4:
                                        var temp_sbyteArray3 = this.get8bitByteArray(dataLength);
                                        output.push(temp_sbyteArray3);
                                        break;
                                    case 8:
                                        var temp_str = this.getKanjiString(dataLength);
                                        output.push(temp_str)
                                }
                            }
                        }
                        return output
                    })
                }(resultBytes, version.VersionNumber, ecLevel.Bits)
            };
            var qrcode = {};

            function URShift(number, bits) {
                return number >= 0 ? number >> bits : (number >> bits) + (2 << ~bits)
            }
            qrcode.imagedata = null, qrcode.width = 0, qrcode.height = 0, qrcode.qrCodeSymbol = null, qrcode.debug = !1, qrcode.maxImgSize = 1048576, qrcode.sizeOfDataLengthInfo = [
                [10, 9, 8, 8],
                [12, 11, 16, 10],
                [14, 13, 16, 12]
            ], qrcode.callback = null, qrcode.vidSuccess = function(stream) {
                qrcode.localstream = stream, qrcode.webkit ? qrcode.video.src = window.webkitURL.createObjectURL(stream) : qrcode.moz ? (qrcode.video.mozSrcObject = stream, qrcode.video.play()) : qrcode.video.src = stream, qrcode.gUM = !0, qrcode.canvas_qr2 = document.createElement("canvas"), qrcode.canvas_qr2.id = "qr-canvas", qrcode.qrcontext2 = qrcode.canvas_qr2.getContext("2d"), qrcode.canvas_qr2.width = qrcode.video.videoWidth, qrcode.canvas_qr2.height = qrcode.video.videoHeight, setTimeout(qrcode.captureToCanvas, 500)
            }, qrcode.vidError = function(error) {
                qrcode.gUM = !1
            }, qrcode.captureToCanvas = function() {
                if (qrcode.gUM) try {
                    if (0 == qrcode.video.videoWidth) return void setTimeout(qrcode.captureToCanvas, 500);
                    qrcode.canvas_qr2.width = qrcode.video.videoWidth, qrcode.canvas_qr2.height = qrcode.video.videoHeight, qrcode.qrcontext2.drawImage(qrcode.video, 0, 0);
                    try {
                        qrcode.decode()
                    } catch (e) {
                        console.log(e), setTimeout(qrcode.captureToCanvas, 500)
                    }
                } catch (e) {
                    console.log(e), setTimeout(qrcode.captureToCanvas, 500)
                }
            }, qrcode.setWebcam = function(videoId) {
                var n = navigator;
                qrcode.video = document.getElementById(videoId);
                var options = !0;
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) try {
                    navigator.mediaDevices.enumerateDevices().then(function(devices) {
                        devices.forEach(function(device) {
                            console.log("deb1"), "videoinput" === device.kind && device.label.toLowerCase().search("back") > -1 && (options = [{
                                sourceId: device.deviceId
                            }]), console.log(device.kind + ": " + device.label + " id = " + device.deviceId)
                        })
                    })
                } catch (e) {
                    console.log(e)
                } else console.log("no navigator.mediaDevices.enumerateDevices");
                n.getUserMedia ? n.getUserMedia({
                    video: options,
                    audio: !1
                }, qrcode.vidSuccess, qrcode.vidError) : n.webkitGetUserMedia ? (qrcode.webkit = !0, n.webkitGetUserMedia({
                    video: options,
                    audio: !1
                }, qrcode.vidSuccess, qrcode.vidError)) : n.mozGetUserMedia && (qrcode.moz = !0, n.mozGetUserMedia({
                    video: options,
                    audio: !1
                }, qrcode.vidSuccess, qrcode.vidError))
            }, qrcode.decode = function(src) {
                if (0 == arguments.length) {
                    if (qrcode.canvas_qr2) var canvas_qr = qrcode.canvas_qr2,
                        context = qrcode.qrcontext2;
                    else context = (canvas_qr = document.getElementById("qr-canvas")).getContext("2d");
                    return qrcode.width = canvas_qr.width, qrcode.height = canvas_qr.height, qrcode.imagedata = context.getImageData(0, 0, qrcode.width, qrcode.height), qrcode.result = qrcode.process(context), null != qrcode.callback && qrcode.callback(qrcode.result), qrcode.result
                }
                var image = new Image;
                image.crossOrigin = "Anonymous", image.onload = function() {
                    var canvas_out = document.getElementById("out-canvas");
                    if (null != canvas_out) {
                        var outctx = canvas_out.getContext("2d");
                        outctx.clearRect(0, 0, 320, 240), outctx.drawImage(image, 0, 0, 320, 240)
                    }
                    var canvas_qr = document.createElement("canvas"),
                        context = canvas_qr.getContext("2d"),
                        nheight = image.height,
                        nwidth = image.width;
                    if (image.width * image.height > qrcode.maxImgSize) {
                        var ir = image.width / image.height;
                        nwidth = ir * (nheight = Math.sqrt(qrcode.maxImgSize / ir))
                    }
                    canvas_qr.width = nwidth + 20, canvas_qr.height = nheight + 20, context.fillStyle = 'white', context.fillRect(0, 0, canvas_qr.width, canvas_qr.height), context.drawImage(image, 10, 10, nwidth, nheight), qrcode.width = canvas_qr.width, qrcode.height = canvas_qr.height;
                    try {
                        qrcode.imagedata = context.getImageData(0, 0, canvas_qr.width, canvas_qr.height)
                    } catch (e) {
                        return qrcode.result = "浏览器不支持读取跨域图像", void(null != qrcode.callback && qrcode.callback(qrcode.result))
                    }
                    try {
                        qrcode.result = qrcode.process(context)
                    } catch (e) {
                        console.log(e), qrcode.result = "解码错误: " + e
                    }
                    null != qrcode.callback && qrcode.callback(qrcode.result)
                }, image.onerror = function() {
                    null != qrcode.callback && qrcode.callback("加载图像失败")
                }, image.src = src
            }, qrcode.isUrl = function(s) {
                return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(s)
            }, qrcode.decode_url = function(s) {
                var escaped = "";
                try {
                    escaped = escape(s)
                } catch (e) {
                    console.log(e), escaped = s
                }
                var ret = "";
                try {
                    ret = decodeURIComponent(escaped)
                } catch (e) {
                    console.log(e), ret = escaped
                }
                return ret
            }, qrcode.decode_utf8 = function(s) {
                return qrcode.isUrl(s) ? qrcode.decode_url(s) : s
            }, qrcode.process = function(ctx) {
                var start = (new Date).getTime(),
                    image = qrcode.grayScaleToBitmap(qrcode.grayscale());
                if (qrcode.debug) {
                    for (var y = 0; y < qrcode.height; y++)
                        for (var x = 0; x < qrcode.width; x++) {
                            var point = 4 * x + y * qrcode.width * 4;
                            qrcode.imagedata.data[point] = (image[x + y * qrcode.width], 0), qrcode.imagedata.data[point + 1] = (image[x + y * qrcode.width], 0), qrcode.imagedata.data[point + 2] = image[x + y * qrcode.width] ? 255 : 0
                        }
                    ctx.putImageData(qrcode.imagedata, 0, 0)
                }
                var qRCodeMatrix = new Detector(image).detect();
                if (qrcode.debug) {
                    for (y = 0; y < qRCodeMatrix.bits.Height; y++)
                        for (x = 0; x < qRCodeMatrix.bits.Width; x++) point = 4 * x * 2 + 2 * y * qrcode.width * 4, qrcode.imagedata.data[point] = (qRCodeMatrix.bits.get_Renamed(x, y), 0), qrcode.imagedata.data[point + 1] = (qRCodeMatrix.bits.get_Renamed(x, y), 0), qrcode.imagedata.data[point + 2] = qRCodeMatrix.bits.get_Renamed(x, y) ? 255 : 0;
                    ctx.putImageData(qrcode.imagedata, 0, 0)
                }
                for (var data = Decoder.decode(qRCodeMatrix.bits).DataByte, str = "", i = 0; i < data.length; i++)
                    for (var j = 0; j < data[i].length; j++) str += String.fromCharCode(data[i][j]);
                var time = (new Date).getTime() - start;
                return console.log(time), qrcode.decode_utf8(str)
            }, qrcode.getPixel = function(x, y) {
                if (qrcode.width < x) throw "块错误";
                if (qrcode.height < y) throw "块错误";
                var point = 4 * x + y * qrcode.width * 4;
                return (33 * qrcode.imagedata.data[point] + 34 * qrcode.imagedata.data[point + 1] + 33 * qrcode.imagedata.data[point + 2]) / 100
            }, qrcode.binarize = function(th) {
                for (var ret = new Array(qrcode.width * qrcode.height), y = 0; y < qrcode.height; y++)
                    for (var x = 0; x < qrcode.width; x++) {
                        var gray = qrcode.getPixel(x, y);
                        ret[x + y * qrcode.width] = gray <= th
                    }
                return ret
            }, qrcode.getMiddleBrightnessPerArea = function(image) {
                for (var areaWidth = Math.floor(qrcode.width / 4), areaHeight = Math.floor(qrcode.height / 4), minmax = new Array(4), i = 0; i < 4; i++) {
                    minmax[i] = new Array(4);
                    for (var i2 = 0; i2 < 4; i2++) minmax[i][i2] = new Array(0, 0)
                }
                for (var ay = 0; ay < 4; ay++)
                    for (var ax = 0; ax < 4; ax++) {
                        minmax[ax][ay][0] = 255;
                        for (var dy = 0; dy < areaHeight; dy++)
                            for (var dx = 0; dx < areaWidth; dx++) {
                                var target = image[areaWidth * ax + dx + (areaHeight * ay + dy) * qrcode.width];
                                target < minmax[ax][ay][0] && (minmax[ax][ay][0] = target), target > minmax[ax][ay][1] && (minmax[ax][ay][1] = target)
                            }
                    }
                for (var middle = new Array(4), i3 = 0; i3 < 4; i3++) middle[i3] = new Array(4);
                for (ay = 0; ay < 4; ay++)
                    for (ax = 0; ax < 4; ax++) middle[ax][ay] = Math.floor((minmax[ax][ay][0] + minmax[ax][ay][1]) / 2);
                return middle
            }, qrcode.grayScaleToBitmap = function(grayScale) {
                for (var middle = qrcode.getMiddleBrightnessPerArea(grayScale), sqrtNumArea = middle.length, areaWidth = Math.floor(qrcode.width / sqrtNumArea), areaHeight = Math.floor(qrcode.height / sqrtNumArea), buff = new ArrayBuffer(qrcode.width * qrcode.height), bitmap = new Uint8Array(buff), ay = 0; ay < sqrtNumArea; ay++)
                    for (var ax = 0; ax < sqrtNumArea; ax++)
                        for (var dy = 0; dy < areaHeight; dy++)
                            for (var dx = 0; dx < areaWidth; dx++) bitmap[areaWidth * ax + dx + (areaHeight * ay + dy) * qrcode.width] = grayScale[areaWidth * ax + dx + (areaHeight * ay + dy) * qrcode.width] < middle[ax][ay];
                return bitmap
            }, qrcode.grayscale = function() {
                for (var buff = new ArrayBuffer(qrcode.width * qrcode.height), ret = new Uint8Array(buff), y = 0; y < qrcode.height; y++)
                    for (var x = 0; x < qrcode.width; x++) {
                        var gray = qrcode.getPixel(x, y);
                        ret[x + y * qrcode.width] = gray
                    }
                return ret
            };
            var MIN_SKIP = 3,
                MAX_MODULES = 57,
                INTEGER_MATH_SHIFT = 8,
                CENTER_QUORUM = 2;

            function AlignmentPattern(posX, posY, estimatedModuleSize) {
                this.x = posX, this.y = posY, this.count = 1, this.estimatedModuleSize = estimatedModuleSize, this.__defineGetter__("EstimatedModuleSize", function() {
                    return this.estimatedModuleSize
                }), this.__defineGetter__("Count", function() {
                    return this.count
                }), this.__defineGetter__("X", function() {
                    return Math.floor(this.x)
                }), this.__defineGetter__("Y", function() {
                    return Math.floor(this.y)
                }), this.incrementCount = function() {
                    this.count++
                }, this.aboutEquals = function(moduleSize, i, j) {
                    if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize) {
                        var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
                        return moduleSizeDiff <= 1 || moduleSizeDiff / this.estimatedModuleSize <= 1
                    }
                    return !1
                }
            }
            return qrcode.orderBestPatterns = function(patterns) {
                function distance(pattern1, pattern2) {
                    var xDiff = pattern1.X - pattern2.X,
                        yDiff = pattern1.Y - pattern2.Y;
                    return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
                }
                var pointA, pointB, pointC, zeroOneDistance = distance(patterns[0], patterns[1]),
                    oneTwoDistance = distance(patterns[1], patterns[2]),
                    zeroTwoDistance = distance(patterns[0], patterns[2]);
                if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance ? (pointB = patterns[0], pointA = patterns[1], pointC = patterns[2]) : zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance ? (pointB = patterns[1], pointA = patterns[0], pointC = patterns[2]) : (pointB = patterns[2], pointA = patterns[0], pointC = patterns[1]), function(pointA, pointB, pointC) {
                        var bX = pointB.x,
                            bY = pointB.y;
                        return (pointC.x - bX) * (pointA.y - bY) - (pointC.y - bY) * (pointA.x - bX)
                    }(pointA, pointB, pointC) < 0) {
                    var temp = pointA;
                    pointA = pointC, pointC = temp
                }
                patterns[0] = pointA, patterns[1] = pointB, patterns[2] = pointC
            }, qrcode
        }(),
        out = 0, scanned = false,
        clearLong = () => {
            clearTimeout(out), out = 0
        }, toaster = (t,q) => {
          (window.via && window.via.toast) ? window.via.toast(t) :
          (window.mbrowser && window.mbrowser.showToast) ?
            window.mbrowser.showToast(t) :
          (window._obj && window._obj.toast) ? window._obj.toast(t) :
          (window.H5EXT && window.H5EXT.cmd) ? window.H5EXT.cmd(99,t) :
          (window.meta && window.meta.toast) ? window.meta.toast(t,3,null) :
          (window.mx_browser_obj && window.mx_browser_obj.showtip) ?
            window.mx_browser_obj.showtip(t) :
          (window.JSInterface && window.JSInterface.syslog) ?
            window.JSInterface.syslog(t) :
          (window.plugin && window.plugin.makeToast) ?
            window.plugin.makeToast(t) :
          (window.mdhtml && window.mdhtml.mdts) ? window.mdhtml.mdts(t) :
          (q) ? console.log(t) : alert(t);
        }, scanner = img => {
          img.addEventListener("touchstart", e => {
            eimg = e.target, text = '\n', eurl = new URL(eimg.src), host = new URL(location),
            eso = ( eurl.host===host.host && eurl.protocol===host.protocol && eurl.port===host.port ),
            enh = ( eurl.protocol!=='https:' && eurl.protocol!=='http:' ),
            decoder.callback = (result => {
              if (result) {
                alert(`识别成功!\n${result}`);
              } else {
                toaster("解码失败",false);
              }
            }),
            out = setTimeout(() => {
              if (BarcodeDetector && host.protocol=='https:' && eso) {
                let barcodeDetector = new BarcodeDetector({formats: 识别类型});
                barcodeDetector.detect(eimg).then(barcodes => {
                  if (barcodes.length>=1) {
                    barcodes.forEach(barcode => { text += `格式:${barcode.format}\n内容:${barcode.rawValue}\n\n` });
                    alert(`识别成功!${text}`); text = '\n';
                  } else {
                    toaster("未识别到二维码",false);
                  }
                },decoder.decode.bind(this,eimg.src));
              } else {
                if (eso || enh) {
                  decoder.decode(eimg.src);
                } else {
                  toaster("正在传输",true);
                  decoder.decode(代理服务器 + 带协议 ? eimg.src : eimg.src.replace(/^\w+\:\/\//, ''));
                }
              }
            }, 按住时间);
          });
          img.addEventListener("touchmove", clearLong);
          img.addEventListener("touchend", clearLong);
        }, observer = new MutationObserver( (mus,obs) => {
          let i = 0;
          for (let mu of mus) {
            if (mu.addedNodes.length>0) {
              i = 0;
              mu.addedNodes.forEach( ad => {
                if (ad.nodeName==='IMG' && i < 动态加载上限) {
                  scanner(ad); i++;
                }
              });
              console.log(`动态加载 ${i} 个图片`);
            }
          }
        }), obsopt = { childList: true, subtree: true }, scanAll = h => {
          let i = 0;
          if (!scanned) {
            document.querySelectorAll("img").forEach( function(img) {
              scanner(img); i++;
              console.log(`阶段 ${h} 加载 ${i} 个图片`);
            });
            scanned = true;
          }
        }, lazyload = () => {
          scanAll(2);
          if (动态捕获) observer.observe(document.documentElement,obsopt);
        };
    window.addEventListener('load', scanAll.bind(this,1));
    setTimeout(lazyload,加载延时);
})();