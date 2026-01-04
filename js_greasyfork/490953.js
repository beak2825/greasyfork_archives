// ==UserScript==
// @name         bloxd.io Creative Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable creative mode in bloxd.io
// @author       Jailbroken ChatGPT
// @match        https://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490953/bloxdio%20Creative%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/490953/bloxdio%20Creative%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Set player's walk speed to 50
    game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = 50;

    // Set player's primary part CFrame to (0, 50, 0)
    game.Players.LocalPlayer.SetPrimaryPartCFrame(CFrame.new(0, 50, 0));

    // Set ground's collision to false
    game.Workspace.ground.CanCollide = false;

    // Set ground's material to SmoothPlastic
    game.Workspace.ground.Material = Enum.Material.SmoothPlastic;

    // Set ground's color to Institutional white
    game.Workspace.ground.BrickColor = BrickColor.new("Institutional white");

    // Set ground's transparency to 0.5
    game.Workspace.ground.Transparency = 0.5;

    // Set ground's anchored to true
    game.Workspace.ground.Anchored = true;

    // Set ground's primary part CFrame to (0, 50, 0)
    game.Workspace.ground.PrimaryPart.CFrame = CFrame.new(0, 50, 0);

    // Iterate over all descendants of ground
    for (const descendant of game.Workspace.ground.GetDescendants()) {
        // Check if descendant is a BasePart
        if (descendant.IsA("BasePart")) {
            // Set descendant's material to SmoothPlastic
            descendant.Material = Enum.Material.SmoothPlastic;

            // Set descendant's color to Institutional white
            descendant.BrickColor = BrickColor.new("Institutional white");

            // Set descendant's transparency to 0.5
            descendant.Transparency = 0.5;

            // Set descendant's anchored to true
            descendant.Anchored = true;

            // Set descendant's primary part CFrame to (0, 50, 0)
            descendant.PrimaryPart.CFrame = CFrame.new(0, 50, 0);
        }
    }

})();