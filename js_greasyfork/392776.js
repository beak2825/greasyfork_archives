// ==UserScript==
// @name          Planets.nu - Meteor's Homeworlds Plugin
// @description   Plugin for Planets.nu which helps to find homeworlds and show areas
// @namespace     Planets.nu
// @version       2.4
// @grant         none
// @date          2022-01-02
// @author        meteor
// @include       http://planets.nu/*
// @include       http://*.planets.nu/*
// @include       https://planets.nu/*
// @include       https://*.planets.nu/*
// @exclude       http://help.planets.nu/*
// @exclude       https://help.planets.nu/*
// @exclude       http://profile*.planets.nu/*
// @exclude       https://profile*.planets.nu/*
// @exclude       http://planets.nu/_library/*
// @exclude       http://api.planets.nu/*

// @downloadURL https://update.greasyfork.org/scripts/392776/Planetsnu%20-%20Meteor%27s%20Homeworlds%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/392776/Planetsnu%20-%20Meteor%27s%20Homeworlds%20Plugin.meta.js
// ==/UserScript==

/* -----------------------------------------------------------------------
 Change log:
 2.0:
 - Feature: Support for new/mobile client added
 - Bug-Fix: checks for Meteor's Library improved
 2.1:
 - Bug-Fix: Treatment of intersection points for parallel lines was incorrect
 2.2:
 - Feature: New switch to use only very close planets (81 ly)
 2.3:
 - Feature from 2.2. removed
 - Feature: 6 levels of potential HW prediction and button to switch through them
 2.4:
 - Feature Improved delta comparison (less false positives)
    - incl. Bug-Fix: some ambiguous planets between 80..82 ly and 161..163 ly were counted or ignored twice
    - Details: no negative delta; positive delta = 1 / sqrt(2); positive delta applies for veryclose-, close- and next-planets
 - Bug-Fix: A selected HW had a brown square around the red square when it was a high-level (thick-square) potential HW 
      and both potential and selected were shown. Not nice to look at and maybe confusing => only the red one now
 - Change: tools menu interaction 
    - Exit-Button added (all clients)
    - In the old client (play.planets.nu): 
        - the way the homeworldtools button group interacts with the tool menu is renewed.
        - Blocking the map tools from closing was removed
            - incl. Bug-Fix: after exiting the game while the homeworldtools were open and entering any game (same or other)
                the map tools didn't work any more
        - "side effect": 
            - Now, when you close the maptools while the homeworldtools are open, the homeworldtools will stay open.
            - You can close them with the new exit button, or reopen the maptools and toggle the HW-button there.
            - While not perfect, this is usable and will not be changed any more (if you don't like it, call it a known bug ;))   
 - Feature: Simple support for debris disks (alpha)
    - Details:
        - The central planetoid of a debris disk counts as a planet assuming it is in the position of an original planet.
        - Other planetoids do not count.
        - There is no attempt to incorporate planets drift due to the creation of a debris disks/explosion of the planet.  
     
 ----------------------------------------------------------------------- */

"use strict";

function wrapper(plugin_version)
{
    let fullName = "Meteor's Homeworlds Plugin";

    if (typeof xLibrary == 'undefined')
    {
        window.alert("Cannot start " + fullName + "!\n\nThe plugin requires Meteor's Library.\nIf the library is installed already make sure it runs before the plugin.");
        throw "Cannot start " + fullName + ". Meteor's Library not found. Plugin disabled.";
    }

    let plugin = new XPlugin(fullName, "xHomeworlds", plugin_version, -20160918, 2.1);

    plugin.setLogEnabled(false);

    let containerRight = xUtils.isMobileClient() ? 40 : 240;

    let css = "<style type='text/css'>";

    css += "#HWToolsContainer {position: absolute; right: " + containerRight + "px; z-index: 16; height: 30px;}";
    css += "#HWToolsContainer .mapbutton {margin-left: 10px; margin-bottom: 10px; float: left;}";
    css += ".HWTools::before {position: absolute; left: 7px; top: 7px; width: 16px; height: 16px; content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAV0lEQVQ4jWNgYGD4TyHGLflWRoU0AwhpwCGPXTEyINkL6JoIGILqNFyKkcXRvILfdiJcQVx0UWQASWFAjGa8YUCCzVQ2gMhki00dDbyAbgsB1xGXDnBhAEpcONJRmdhMAAAAAElFTkSuQmCC');}";
    css += ".HWPotential::before {position: absolute; left: 7px; top: 7px; width: 16px; height: 16px; content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQ0lEQVQ4jWNgYGD4TyGmkgH/DzSQhLEaQKytRBnA+P8/CibJAHTN6IbgNQCXZmRDhrsBFAciVaKR7IREUVKmODORiwGQfMmwgj8zPAAAAABJRU5ErkJggg==');}";
    css += ".HWSelected::before {position: absolute; left: 7px; top: 7px; width: 16px; height: 16px; content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQ0lEQVQ4jWNgYGD4TyGmkgFvZVRIwlgNINZWogxg/P8fBZNkALpmdEPwGoBLM7Ihw90AigORKtFIdkKiKClTnJnIxQDXSJqYYNY0/QAAAABJRU5ErkJggg==');}";
    css += ".HWPieslices::before {position: absolute; left: 7px; top: 7px; width: 16px; height: 16px; content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAASklEQVQ4jWNgYGD4Twn+////fwYYgxLAgGQauum4bEXh09YQYg2mjyHI4vjkCRpCjByKIZQA6rqEJmGCLoZLDW0NIeQ92hpCCQAAX3xOztMy/IoAAAAASUVORK5CYII=');}";
    css += ".HWAreas::before {position: absolute; left: 7px; top: 7px; width: 16px; height: 16px; content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZElEQVQ4jZWSMRIAIQgD9/+fzhVe4aiEUNAgLBECIEkCrqjyR9TFHeB/9w2BOt8QQO8HB3kA+8kVGNDKmn/a5tcOpvsoAQNv1HIjyLmDUPY+sJfeODIrjK6QeD820uC8c8Be/wE4e5R6/RMhbwAAAABJRU5ErkJggg==');}";
    css += ".HWSelectMode::before {position: absolute; left: 7px; top: 7px; width: 16px; height: 16px; content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATUlEQVQ4jbXSMQ4AIAwCQP7/aVyN2gIaB5YON1AAgHNIcr2J7ECInIEAqQET6QED0YBAPKBBfKBAPnUQbKJfYlzixTL12qIvfAEE8gYMPuqsYu1i0jgAAAAASUVORK5CYII=');}";
    css += ".HWSave::before {position: absolute; left: 7px; top: 7px; width: 16px; height: 16px; content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAS0lEQVQ4jWNgYGD4TyGGMBwc/pOEcRpACOA0ACb5//////X19VgxshrquwDZAEIuoE0YUM0AiqORYgMYGA7gxSQYwDDUDKA4N5KLAVUbBv9JdSpFAAAAAElFTkSuQmCC');}";

    css += "</style>";
    $("head:first").append(css);

    const DELTA = 1 / Math.sqrt(2);

    const MAX_LEVEL = 6;
    const LEVEL_COLORS = ["#806020", "#C09050", "#FFC080", "#FFC080", "#FFC080", "#FFE0A0"];
    
    plugin.toolsContainerTop = 12;
    
    plugin.processload = function()
    {
        plugin.selectedHomeworlds = plugin.getObjectFromNote(0);
        if (plugin.selectedHomeworlds == null)
        {
            plugin.selectedHomeworlds = new Array();
        }

        plugin.isSelectedHomeworldsModified = false;

        plugin.show = plugin.getObjectFromNote(1);
        if (plugin.show == null)
        {
            plugin.show =
                {
                    potentialHomeworlds: false,
                    selectedHomeworlds: false,
                    pieslices: false,
                    areas: false,
                };
        }

        if (plugin.show.level == null)
        {
            plugin.show.level = (vgap.settings.nextplanets > 0) ? 2 : 3;
        }
        
        plugin.isInSelectMode = false;

        if (plugin.gameId != vgap.game.id)
        {
            plugin.gameId = vgap.game.id;
        }

        plugin.potentialHomeworlds = null;
        plugin.homeworldAreas = null;

        plugin.initPotentialHomeworlds();
    };

    plugin.initPotentialHomeworlds = function()
    {
        let planets = [];

        for (let i = 0; i < vgap.planets.length; i++)
        {
            let planet = vgap.planets[i];
            if (planet.id < 0)
            {
                continue;
            }

            if (planet.debrisdisk > 0)
            {
                continue;
            }

            planets.push(planet);
        }
        
        for (let planet of vgap.debrisdisks)
        {
            if (planet.id < 0)
            {
                continue;
            }

            planets.push(planet);
        }
        
        let counts = [];
        
        for (let i = 0; i < planets.length; i++)
        {
            counts.push(
                {
                    veryClose: 0,
                    veryCloseAmbiguous: 0,
                    totalClose: 0,
                    totalCloseAmbiguous: 0,
                    totalNext: 0,
                    totalNextAmbiguous: 0
                });
        }

        for (let i = 0; i < planets.length; i++)
        {
            let p1 = planets[i];

            for (let k = i + 1; k < planets.length; k++)
            {
                let p2 = planets[k];

                let dist = xMapUtils.getSphereDistance(p1, p2);

                if (plugin.isLogEnabled() //
                    && (   ((dist > 80) && (dist < 82)) //
                        || ((dist > 161) && (dist < 163)) //
                        || ((dist > 323) && (dist < 325))))
                {
                    plugin.log(p1.id + " <-> " + p2.id + " = " + dist);
                }

                if (dist < 81 + DELTA)
                {
                    counts[i].veryClose++;
                    counts[i].totalClose++;
                    counts[i].totalNext++;

                    counts[k].veryClose++;
                    counts[k].totalClose++;
                    counts[k].totalNext++;

                    if (dist > vgap.settings.otherplanetsminhomeworlddist)
                    {
                        counts[i].veryCloseAmbiguous++;
                        counts[i].totalCloseAmbiguous++;
                        counts[i].totalNextAmbiguous++;

                        counts[k].veryCloseAmbiguous++;
                        counts[k].totalCloseAmbiguous++;
                        counts[k].totalNextAmbiguous++;
                    }
                    else if (dist > 81)
                    {
                        counts[i].veryCloseAmbiguous++;
                        counts[k].veryCloseAmbiguous++;
                    }
                }
                else if (dist < 162 + DELTA)
                {
                    counts[i].totalClose++;
                    counts[i].totalNext++;

                    counts[k].totalClose++;
                    counts[k].totalNext++;

                    if (dist > vgap.settings.otherplanetsminhomeworlddist)
                    {
                        counts[i].totalCloseAmbiguous++;
                        counts[i].totalNextAmbiguous++;

                        counts[k].totalCloseAmbiguous++;
                        counts[k].totalNextAmbiguous++;
                    }
                    else if (dist > 162)
                    {
                        counts[i].totalCloseAmbiguous++;
                        counts[k].totalCloseAmbiguous++;
                    }
                }
                else if (dist < 324 + DELTA)
                {
                    counts[i].totalNext++;
                    counts[k].totalNext++;

                    if ((dist > 324) || (dist > vgap.settings.otherplanetsminhomeworlddist))
                    {
                        counts[i].totalNextAmbiguous++;
                        counts[k].totalNextAmbiguous++;
                    }
                }
            }
        }

        plugin.potentialHomeworlds = [];
        for (let level = 0; level < MAX_LEVEL; level++)
        {
            plugin.potentialHomeworlds.push([]);
        }    

        if (plugin.isLogEnabled())
        {
            for (let i = 0; i < counts.length; i++)
            {
                if (planets[i].id >= 0)
                {
                    plugin.log(planets[i].id + ": [" + counts[i].veryClose + ", " + counts[i].veryCloseAmbiguous 
                               + ", " + counts[i].totalClose + ", " + counts[i].totalCloseAmbiguous
                               + ", " + counts[i].totalNext + ", " + counts[i].totalNextAmbiguous + "]");
                }
            }
        }

        let veryClose = vgap.settings.verycloseplanets;
        let totalClose = veryClose + vgap.settings.closeplanets;
        let totalNext = totalClose + (vgap.settings.nextplanets > 0 ? vgap.settings.nextplanets : 0);
        
        for (let i = 0; i < counts.length; i++)
        {
            let count = counts[i];

            if ((count.veryClose >= veryClose) && (count.veryClose - count.veryCloseAmbiguous <= veryClose))
            {
                plugin.potentialHomeworlds[0].push(planets[i].id);
                
                if (count.totalClose >= totalClose)
                {
                    plugin.potentialHomeworlds[1].push(planets[i].id);
                    
                    let isCloseExact = false;
                    
                    if (count.totalClose - count.totalCloseAmbiguous <= totalClose)
                    {
                        isCloseExact = true;
                        plugin.potentialHomeworlds[3].push(planets[i].id);
                    }

                    if ((vgap.settings.nextplanets > 0) && (count.totalNext >= totalNext))
                    {
                        plugin.potentialHomeworlds[2].push(planets[i].id);
                        
                        if (isCloseExact)
                        {
                            plugin.potentialHomeworlds[4].push(planets[i].id);
                            
                            if (count.totalNext - count.totalNextAmbiguous <= totalNext)
                            {
                                plugin.potentialHomeworlds[5].push(planets[i].id);
                            }
                        }
                    }
                }
            }
        }

        if (plugin.isLogEnabled())
        {
            for (let level = 0; level < MAX_LEVEL; level++)
            {
                if (!plugin.isLevelAvailable(level))
                {
                    continue;
                } 
                
                let potentialHomeworldIds = "potentialHomeworldIds[" + (level + 1) + "] = [";
                for (let i = 0; i < plugin.potentialHomeworlds[level].length; i++)
                {
                    potentialHomeworldIds += ((i > 0) ? ", " : "") + plugin.potentialHomeworlds[level][i];
                }
    
                plugin.log(potentialHomeworldIds + "]");
            }
        }
    };

    plugin.isLevelAvailable = function(level)
    {
        return (vgap.settings.nextplanets > 0) || (level == 0) || (level == 1) || (level == 3);
    };
    
    plugin.calculateAreas = function()
    {
        if (plugin.selectedHomeworlds.length == 0)
        {
            return;
        }

        plugin.homeworldAreas = [];

        let mapBoundingRect = xMapUtils.getMapBoundingRect();
        let mapWidth = mapBoundingRect.getWidth();
        let mapHeight = mapBoundingRect.getHeight();

        let allLines = [];
        for (let i = 0; i < plugin.selectedHomeworlds.length; i++)
        {
            let p1 = XPoint.fromPoint(vgap.getPlanet(plugin.selectedHomeworlds[i]));
            let lines = [];

            for (let j = 0; j < plugin.selectedHomeworlds.length; j++)
            {
                if (j == i)
                {
                    continue;
                }

                let p2 = XPoint.fromPoint(vgap.getPlanet(plugin.selectedHomeworlds[j]));

                lines.push(XLine.getPerpendicularBisector(p1, p2));

                if (vgap.settings.sphere)
                {
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(-mapWidth, -mapHeight)));
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(-mapWidth, 0)));
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(-mapWidth, +mapHeight)));
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(0, -mapHeight)));
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(0, +mapHeight)));
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(+mapWidth, -mapHeight)));
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(+mapWidth, 0)));
                    lines.push(XLine.getPerpendicularBisector(p1, p2.offsetXY(+mapWidth, +mapHeight)));
                }
            }

            if (vgap.settings.sphere)
            {
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(-mapWidth, -mapHeight)));
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(-mapWidth, 0)));
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(-mapWidth, +mapHeight)));
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(0, -mapHeight)));
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(0, +mapHeight)));
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(+mapWidth, -mapHeight)));
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(+mapWidth, 0)));
                lines.push(XLine.getPerpendicularBisector(p1, p1.offsetXY(+mapWidth, +mapHeight)));
            }
            else
            {
                lines.push(mapBoundingRect.getLeftSection().getLine());
                lines.push(mapBoundingRect.getRightSection().getLine());
                lines.push(mapBoundingRect.getTopSection().getLine());
                lines.push(mapBoundingRect.getBottomSection().getLine());
            }

            allLines.push(lines);
        }

        iterate_homeworlds: //
        for (let i = 0; i < plugin.selectedHomeworlds.length; i++)
        {
            let homeworld = vgap.getPlanet(plugin.selectedHomeworlds[i]);
            let p1 = XPoint.fromPoint(homeworld);
            lines = allLines[i];

            let closestP2 = null;
            let closestDist = mapWidth + mapHeight;

            let startLine;
            let startPoint;

            if (plugin.selectedHomeworlds.length == 1)
            {
                let virtualP2 = new XPoint(p1.x - mapWidth, p1.y);
                startLine = lines[1]; // intentionally not 0, suits to virtualP2 in both cases
                startPoint = startLine.getIntersectionPoint(XLine.fromPoints(p1, virtualP2));
            }
            else
            {
                for (let j = 0; j < plugin.selectedHomeworlds.length; j++)
                {
                    if (j == i)
                    {
                        continue;
                    }

                    let p2 = XPoint.fromPoint(vgap.getPlanet(plugin.selectedHomeworlds[j]));
                    let dist = xMapUtils.getSphereDistance(p1, p2);

                    if (dist < closestDist)
                    {
                        closestDist = dist;
                        closestP2 = p2;
                    }
                }

                if (vgap.settings.sphere)
                {
                    if (closestP2.x - p1.x > mapWidth / 2)
                    {
                        closestP2.x -= mapWidth;
                    }
                    if (closestP2.x - p1.x < -mapWidth / 2)
                    {
                        closestP2.x += mapWidth;
                    }
                    if (closestP2.y - p1.y > mapHeight / 2)
                    {
                        closestP2.y -= mapHeight;
                    }
                    if (closestP2.y - p1.y < -mapHeight / 2)
                    {
                        closestP2.y += mapHeight;
                    }
                }

                startLine = XLine.getPerpendicularBisector(p1, closestP2);
                startPoint = startLine.getIntersectionPoint(XLine.fromPoints(p1, closestP2));
            }

            let heading = xMapUtils.getHeading(p1, startPoint) + 90;
            if (heading >= 360)
            {
                heading -= 360;
            }

            let area = [];
            let maxCycles = lines.length + 2;

            for (var cycle = 0; cycle < maxCycles; cycle++)
            {
                let bestPoint = null;
                let bestLine = null;
                let bestHeading = null;

                for (let k = 0; k < lines.length; k++)
                {
                    let curLine = lines[k];

                    let curPoint = startLine.getIntersectionPoint(curLine);

                    if (curPoint != null)
                    {
                        if (((bestPoint != null) && (curPoint.x == bestPoint.x) && (curPoint.y == bestPoint.y) && this.isBetterHeading(this.getNewHeading(curLine, heading), bestHeading, heading)) || this.isCloser(curPoint, bestPoint, startPoint, heading))
                        {
                            bestPoint = curPoint;
                            bestLine = curLine;
                            bestHeading = this.getNewHeading(bestLine, heading);
                        }
                    }
                }

                if (bestPoint == null)
                {
                    plugin.logWarning("bestPoint not found");

                    continue iterate_homeworlds;
                }

                if ((area.length > 0) && (area[0].x == bestPoint.x) && (area[0].y == bestPoint.y))
                {
                    plugin.homeworldAreas.push(
                        {
                            homeworld: homeworld,
                            area: area
                        });

                    break;
                }

                area.push(bestPoint);

                startPoint = bestPoint;
                startLine = bestLine;
                heading = bestHeading;
            }

            if (cycle >= maxCycles)
            {
                plugin.logWarning("Cannot calculate area!");

                for (i = 0; i < area.length; i++)
                {
                    plugin.logWarning("area[" + i + "] = (" + area[i].x + ", " + area[i].y + ")");
                }
            }
        }
    };

    plugin.isCloser = function(curPoint, bestPoint, startPoint, heading)
    {
        if (curPoint == null)
        {
            return false;
        }

        if ((heading >= 45) && (heading < 135))
        {
            return ((curPoint.x > startPoint.x) && ((bestPoint == null) || (curPoint.x < bestPoint.x)));
        }

        if ((heading >= 135) && (heading < 225))
        {
            return ((curPoint.y < startPoint.y) && ((bestPoint == null) || (curPoint.y > bestPoint.y)));
        }

        if ((heading >= 225) && (heading < 315))
        {
            return ((curPoint.x < startPoint.x) && ((bestPoint == null) || (curPoint.x > bestPoint.x)));
        }

        return ((curPoint.y > startPoint.y) && ((bestPoint == null) || (curPoint.y < bestPoint.y)));
    };

    plugin.getNewHeading = function(line, curHeading)
    {
        let newHeading = line.getHeading();
        while (newHeading < curHeading)
        {
            newHeading += 180;

        }
        if (newHeading >= 360)
        {
            newHeading -= 360;
        }

        return newHeading;
    };

    plugin.isBetterHeading = function(newHeading, bestHeading, curHeading)
    {
        let h2 = newHeading;
        if (h2 - curHeading < 0)
        {
            h2 += 360;
        }

        let h1 = bestHeading;
        if (h1 - curHeading < 0)
        {
            h1 += 360;
        }

        return h2 > h1;
    };

    plugin.loadmap = function()
    {
        xMapUtils.addMapTool("Homeworlds", "HWTools", plugin.toggleHomeworldTools);
    };

    plugin.toggleHomeworldTools = function(e)
    {
        if ($("#HWToolsContainer").length == 0)
        {
            plugin.openHomeworldTools(e);
        }
        else
        {
            plugin.closeHomeworldTools(e);
        }
    };

    plugin.openHomeworldTools = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        $(".HWTools").toggleClass(xUtils.isMobileClient() ?  "toolactive" : "selectedmaptool", true);

        plugin.updateHomeworldTools();
    }

    plugin.closeHomeworldTools = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        if (plugin.isInSelectMode)
        {
            plugin.toggleSelectMode(e);
        }

        plugin.saveObjectAsNote(1, plugin.show);
        
        $("#HWToolsContainer").remove();
        
        $(".HWTools").toggleClass(xUtils.isMobileClient() ?  "toolactive" : "selectedmaptool", false);
        vgap.map.closeTools();
    };

    plugin.updateHomeworldTools = function()
    {
        $("#HWToolsContainer").remove();
        let showPieslicesButton = ((vgap.settings.hwdistribution == 2) // hw in a circle
        || (vgap.settings.hwdistribution == 4)); // center + circle (MvM)

        $("<div id='HWToolsContainer'></div>").appendTo("#MapControls");
        if (xUtils.isMobileClient() || $("#MapTools").is(":visible"))
        {
            plugin.toolsContainerTop = document.getElementsByClassName("HWTools")[0].offsetTop;
        }
        
        $("#HWToolsContainer").css("top", plugin.toolsContainerTop + "px").css("width", "160px");

        xMapUtils.addMapTool("Show Potential Homeworlds", "HWPotential" + (plugin.show.potentialHomeworlds ? " toolactive" : ""), plugin.toggleShowPotentialHomeworlds, "#HWToolsContainer");
        xMapUtils.addMapTool("Show Selected Homeworlds", "HWSelected" + (plugin.show.selectedHomeworlds ? " toolactive" : ""), plugin.toggleShowSelectedHomeworlds, "#HWToolsContainer");
        if (showPieslicesButton)
        {
            xMapUtils.addMapTool("Show Pieslices", "HWPieslices" + (plugin.show.pieslices ? " toolactive" : ""), plugin.toggleShowPieslices, "#HWToolsContainer");
        }
                    
        xMapUtils.addMapTool("Show Areas", "HWAreas" + (plugin.show.areas ? " toolactive" : ""), plugin.toggleShowAreas, "#HWToolsContainer");
        xMapUtils.addMapTool("Select HW", "HWSelectMode" + (plugin.isInSelectMode ? " toolactive" : ""), plugin.toggleSelectMode, "#HWToolsContainer");
        xMapUtils.addMapTool("Save Selected HWs", "HWSave", plugin.saveSelectedHomeworlds, "#HWToolsContainer");
        if (plugin.isSelectedHomeworldsModified)
        {
            $("#HWToolsContainer .HWSave").css("background", "#00FF00");
        }
        xMapUtils.addMapTool("Potential Homeworlds Level", "HWLevel", plugin.toggleLevel, "#HWToolsContainer");
        $("#HWToolsContainer .HWLevel").append("<div style='margin-top: 5px;'>" + (plugin.show.level + 1) + "</div>");
        
        xMapUtils.addMapTool("Exit", "HWExit", plugin.closeHomeworldTools, "#HWToolsContainer");
        $("#HWToolsContainer .HWExit").append("<div style='margin-top: 5px;'>X</div>");

        if (!showPieslicesButton)
        {
            $("#HWToolsContainer .HWExit").detach().insertAfter("#HWToolsContainer .HWAreas");
        }
        
        $("body").css("cursor", (plugin.isInSelectMode ? "crosshair" : ""));
    };

    plugin.showdashboard = function()
    {
        $("#HWToolsContainer").hide();
    };

    plugin.showmap = function()
    {
        $("#HWToolsContainer").show();
    };

    plugin.toggleShowPotentialHomeworlds = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        plugin.show.potentialHomeworlds = !plugin.show.potentialHomeworlds;
        plugin.updateHomeworldTools();
        vgap.map.draw();
    };

    plugin.toggleShowSelectedHomeworlds = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }
        
        plugin.show.selectedHomeworlds = !plugin.show.selectedHomeworlds;
        plugin.updateHomeworldTools();
        vgap.map.draw();
    };

    plugin.toggleShowPieslices = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        plugin.show.pieslices = !plugin.show.pieslices;
        plugin.updateHomeworldTools();
        vgap.map.draw();
    };

    plugin.toggleShowAreas = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        plugin.show.areas = !plugin.show.areas;
        plugin.updateHomeworldTools();
        vgap.map.draw();
    };

    plugin.toggleSelectMode = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        plugin.isInSelectMode = !plugin.isInSelectMode;
        plugin.updateHomeworldTools();
        vgap.map.draw();
    };

    plugin.saveSelectedHomeworlds = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        if (plugin.isSelectedHomeworldsModified)
        {
            plugin.saveObjectAsNote(0, plugin.selectedHomeworlds);
            plugin.isSelectedHomeworldsModified = false;
            plugin.updateHomeworldTools();
        }
    };

    plugin.toggleLevel = function(e)
    {
        if (e != null)
        {
            e.stopPropagation();
            e.preventDefault();
        }
        
        let level = plugin.show.level;
        do
        {
            level--;
            if (level < 0)
            {
                level = MAX_LEVEL - 1;
            }
        }
        while (!plugin.isLevelAvailable(level));
        
        plugin.show.level = level;
        plugin.updateHomeworldTools();
        vgap.map.draw();
    };

    plugin.draw = function()
    {
        let map = vgap.map;
        let mapBoundingRect = xMapUtils.getMapBoundingRect();
        let homeworldCenter = mapBoundingRect.getCenterPoint();

        // draw rectangles around potential HWs
        if ((plugin.show.potentialHomeworlds || plugin.isInSelectMode))
        {
            for (let level = plugin.show.level; level < MAX_LEVEL; level++)
            {
                if (!plugin.isLevelAvailable(level))
                {
                    continue;
                }
                
                let drawParams = new XDrawParams().setStrokeStyle(LEVEL_COLORS[level]);
                
                for (let i = 0; i < plugin.potentialHomeworlds[level].length; i++)
                {
                    let planet = vgap.getPlanet(plugin.potentialHomeworlds[level][i]);
    
                    let rad = (map.planetRad(planet) + 3) / map.zoom;
                    let rect = new XRect(planet.x - rad, planet.y - rad, planet.x + rad, planet.y + rad);
    
                    xMapUtils.drawRect(rect, drawParams);
                    
                    if (level > 3)
                    {
                        if ((plugin.show.selectedHomeworlds || plugin.isInSelectMode) && plugin.selectedHomeworlds.includes(planet.id))
                        {
                            continue;
                        }

                        let rad = (map.planetRad(planet) + 4) / map.zoom;
                        let rect = new XRect(planet.x - rad, planet.y - rad, planet.x + rad, planet.y + rad);
    
                        xMapUtils.drawRect(rect, drawParams);
                    }
                }
            }
        }

        // draw rectangles around selected HWs
        if (plugin.show.selectedHomeworlds || plugin.isInSelectMode)
        {
            let drawParams = new XDrawParams().setStrokeStyle("#FF0000");

            for (let i = 0; i < plugin.selectedHomeworlds.length; i++)
            {
                let planet = vgap.getPlanet(plugin.selectedHomeworlds[i]);

                let rad = (map.planetRad(planet) + 3) / map.zoom;
                let rect = new XRect(planet.x - rad, planet.y - rad, planet.x + rad, planet.y + rad);

                xMapUtils.drawRect(rect, drawParams);
            }
        }

        // draw circles to assist the user in localizing HWs
        if (plugin.isInSelectMode)
        {
            if (vgap.settings.hwdistribution == 1) // HW random spaced
            {
                let rad = Math.sqrt((mapBoundingRect.getWidth() * mapBoundingRect.getHeight()) / vgap.players.length);

                for (let i = 0; i < vgap.planets.length; i++)
                {
                    let planet = vgap.planets[i];
                    let id = planet.id < 0 ? -planet.id : planet.id;

                    if (plugin.selectedHomeworlds.indexOf(id) >= 0)
                    {
                        map.drawCircle(map.ctx, xMapUtils.screenX(planet.x), xMapUtils.screenY(planet.y), rad * map.zoom, "#FFFFFF", 1);
                    }
                }
            }
            else if ((vgap.settings.hwdistribution == 2) // HW in a circle
                     || (vgap.settings.hwdistribution == 4)) // center + circle (MvM)
            {
                let centerRadius = mapBoundingRect.getWidth() / 6;

                if (vgap.settings.hwdistribution == 4)
                {
                    map.drawCircle(map.ctx, xMapUtils.screenX(homeworldCenter.x), xMapUtils.screenY(homeworldCenter.y), centerRadius * map.zoom, "#0000FF", 1);
                }

                let countCenterHomeworlds = 0;

                let dist = 0;
                for (let i = 0; i < plugin.selectedHomeworlds.length; i++)
                {
                    let planet = vgap.getPlanet(plugin.selectedHomeworlds[i]);
                    let curDist = xMapUtils.getSphereDistance(homeworldCenter, planet);
                    if ((vgap.settings.hwdistribution == 4) && (curDist < centerRadius))
                    {
                        countCenterHomeworlds += 1;
                    }
                    else
                    {
                        dist += curDist;
                    }
                }

                if (plugin.selectedHomeworlds.length - countCenterHomeworlds > 0)
                {
                    dist /= (plugin.selectedHomeworlds.length - countCenterHomeworlds);

                    map.drawCircle(map.ctx, xMapUtils.screenX(homeworldCenter.x), xMapUtils.screenY(homeworldCenter.y), dist * map.zoom, "#FFFFFF", 1);

                    let rad = 2 * Math.sin(Math.PI / (vgap.players.length - ((vgap.settings.hwdistribution == 4) ? 1 : 0))) * dist;

                    for (let i = 0; i < plugin.selectedHomeworlds.length; i++)
                    {
                        let planet = vgap.getPlanet(plugin.selectedHomeworlds[i]);

                        if ((vgap.settings.hwdistribution != 4) || (xMapUtils.getSphereDistance(homeworldCenter, planet) >= centerRadius))
                        {
                            map.drawCircle(map.ctx, xMapUtils.screenX(planet.x), xMapUtils.screenY(planet.y), rad * map.zoom, "#FFFFFF", 1);
                        }
                    }
                }
            }
        }

        // draw pie slices
        if (plugin.show.pieslices)
        {
            let centerRadius = mapBoundingRect.getWidth() / 6;

            if (vgap.settings.hwdistribution == 4)
            {
                map.drawCircle(map.ctx, xMapUtils.screenX(homeworldCenter.x), xMapUtils.screenY(homeworldCenter.y), centerRadius * map.zoom, "#FFFFFF", 1);
            }

            let mapAngles = new Array();
            mapAngles.push(xMapUtils.getHeading(homeworldCenter, mapBoundingRect.getRightTopPoint()));
            mapAngles.push(xMapUtils.getHeading(homeworldCenter, mapBoundingRect.getRightBottomPoint()));
            mapAngles.push(xMapUtils.getHeading(homeworldCenter, mapBoundingRect.getLeftBottomPoint()));
            mapAngles.push(xMapUtils.getHeading(homeworldCenter, mapBoundingRect.getLeftTopPoint()));

            let angles = new Array();
            for (let i = 0; i < plugin.selectedHomeworlds.length; i++)
            {
                let planet = vgap.getPlanet(plugin.selectedHomeworlds[i]);
                let curDist = xMapUtils.getSphereDistance(homeworldCenter, planet);
                if ((vgap.settings.hwdistribution != 4) || (curDist >= centerRadius))
                {
                    angles.push(xMapUtils.getHeading(homeworldCenter, planet));
                }
            }

            angles.sort(function(a, b)
            {
                return a - b;
            });

            let sections = [];

            for (let i = 0; i < angles.length; i++)
            {
                let angle1 = angles[i];
                let angle2 = angles[i == angles.length - 1 ? 0 : i + 1] + (i == angles.length - 1 ? 360 : 0);
                let angle = (angle1 + angle2) / 2;
                let angleRad = angle * Math.PI / 180;

                let x1 = (vgap.settings.hwdistribution == 4) ? homeworldCenter.x + centerRadius * Math.sin(angleRad) : homeworldCenter.x;
                let y1 = (vgap.settings.hwdistribution == 4) ? homeworldCenter.y + centerRadius * Math.cos(angleRad) : homeworldCenter.y;

                let x2;
                let y2;
                if ((angle <= mapAngles[0]) || (angle > mapAngles[3]))
                {
                    y2 = mapBoundingRect.top;
                    x2 = homeworldCenter.x + Math.tan(angleRad) * (y2 - homeworldCenter.y);
                }
                else if ((angle > mapAngles[0]) && (angle <= mapAngles[1]))
                {
                    x2 = mapBoundingRect.right;
                    y2 = homeworldCenter.y + (x2 - homeworldCenter.x) / Math.tan(angleRad);
                }
                else if ((angle > mapAngles[1]) && (angle <= mapAngles[2]))
                {
                    y2 = mapBoundingRect.bottom;
                    x2 = homeworldCenter.x + Math.tan(angleRad) * (y2 - homeworldCenter.y);
                }
                else if ((angle > mapAngles[2]) && (angle <= mapAngles[3]))
                {
                    x2 = mapBoundingRect.left;
                    y2 = homeworldCenter.y + (x2 - homeworldCenter.x) / Math.tan(angleRad);
                }

                sections.push(new XLineSection(x1, y1, x2, y2));
            }

            let drawParams = new XDrawParams().setStrokeStyle("#FFFFFF").setSphereDuplication(xConst.sphereDuplication.NONE);

            for (let i = 0; i < sections.length; i++)
            {
                xMapUtils.drawLineSection(sections[i], drawParams);
            }

            xMapUtils.drawRect(mapBoundingRect, drawParams);
        }

        // draw areas
        if (plugin.show.areas && (plugin.selectedHomeworlds.length > 0))
        {
            if (plugin.homeworldAreas == null)
            {
                plugin.calculateAreas();
            }

            let drawParams = new XDrawParams().setStrokeStyle("#FFFFFF");

            for (let i = 0; i < plugin.homeworldAreas.length; i++)
            {
                let area = plugin.homeworldAreas[i].area;

                let lastPoint = area[area.length - 1];
                for (let j = 0; j < area.length; j++)
                {
                    let curPoint = area[j];

                    xMapUtils.drawLineSection(XLineSection.fromPoints(lastPoint, curPoint), drawParams);

                    lastPoint = curPoint;
                }
            }
        }
    };

    plugin.oldVgapMapClick = vgapMap.prototype.click;
    vgapMap.prototype.click = function(_shift)
    {
        let map = vgap.map;

        if (plugin.isInSelectMode)
        {
            if ((map.over != null) && map.over.isPlanet)
            {
                let planet = map.over;
                let id = planet.id < 0 ? -planet.id : planet.id;
                let found = false;

                for (let i = 0; i < plugin.selectedHomeworlds.length; i++)
                {
                    if (id == plugin.selectedHomeworlds[i])
                    {
                        plugin.selectedHomeworlds.splice(i, 1);
                        found = true;

                        break;
                    }
                }

                if (!found)
                {
                    plugin.selectedHomeworlds.push(id);
                }

                plugin.isSelectedHomeworldsModified = true;
                plugin.homeworldAreas = null;

                plugin.updateHomeworldTools();
                map.draw();
            }
        }
        else
        {
            plugin.oldVgapMapClick.apply(this, arguments);
        }

    };
} // wrapper for injection

let script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")(\"" + GM_info.script.version + "\");";
document.body.appendChild(script);
document.body.removeChild(script);
