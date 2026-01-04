// ==UserScript==
// @version      1.0
// @author       https://github.com/bababoyy
// @license      GPLv3
// ==/UserScript==
window.onMxobotLoaded = window.onMxobotLoaded || [];
window.onMxobotLoaded.push(function () {
  function filter(tasks) {
    return tasks.filter(
      (x) =>
        x.color != window.MxobotWS.BBY_get_pixel(x.x, x.y) && x.color != -1
    );
  }

  function PatternExtensionGenerate(pattern) {
    return function () {
        Mxobot.Tasker.onTaskAction = function (task) {
        if (task == undefined) return;
        let chunkCoord = [
          Math.floor(task.x / pattern[0].length) * pattern[0].length,
          Math.floor(task.y / pattern.length) * pattern.length,
        ];
        let patternCoord = [task.x - chunkCoord[0], task.y - chunkCoord[1]];
        let ascii = pattern[patternCoord[1]][patternCoord[0]];
        if (ascii == "p") {
          return false;
        } else if (ascii == "X") {
          task.color = Mxobot.getSelectedColor();
        } else {
          task.color = ascii.charCodeAt(0) - "0".charCodeAt(0);
        }
        return true;
      };
    };
  }
  var amogus = ["ppppp", "p555p", "5500p", "5555p", "p555p", "p5p5p", "ppppp"];
  Mxobot.extensions.push([PatternExtensionGenerate(amogus), "amogus"]);
  Mxobot.extensions.push([
    PatternExtensionGenerate(["L5", "5L"]),
    "gmod missing texture",
  ]);

  Mxobot.extensions.push([
    PatternExtensionGenerate(["S", "J", "0", "J", "S"]),
    "trans",
  ]);
  Mxobot.extensions.push([
    PatternExtensionGenerate(["D", ">", "<", "8", "Q", "M"]),
    "lgbt",
  ]);
  Mxobot.extensions.push([
    PatternExtensionGenerate(["K", "J", "0", "U", "0", "J"]),
    "femboy",
  ]);

  Mxobot.extensions.push([
    function () {
      PatternExtensionGenerate(Mxobot.Menu.pixif)();
    },
    "Generate pattern by image",
  ]);

  Mxobot.extensions.push([
    function () {
      var rectsize = 2;
      function ontask(task) {
        return (
          task != undefined &&
          (task.y % (rectsize + 1) == 0 || task.x % (rectsize + 1) >= rectsize)
        );
      }
      Mxobot.Tasker.onTaskAction = ontask;
      Mxobot.Tasker.onImageTaskReorganize = function (tasks) {
        return tasks.filter(ontask);
      };
    },
    "┼ styled pixelating",
  ]);
  Mxobot.extensions.push([
    function () {
      /**
       * Shuffles array in place.
       * @param {Array} a items An array containing the items.
       */
      function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
        }
        return a;
      }
      Mxobot.Tasker.onImageTaskReorganize = function (tasks) {
        tasks = shuffle(tasks);
        tasks = filter(tasks);
        // change pixelradius from localstorage or keep it as 5
        var pixelRadius = localStorage.pixelradius - 0 || 5;
        var newTasks = Array.from(tasks);
        var pixels = [];
        var stucknum = 0;
        while (newTasks.length != 0) {
          var found_a_match = false;
          var task = newTasks.shift();
          if (pixels.length == 0) {
            pixels.push(task);
            found_a_match = true;
          } else if (stucknum > newTasks.length) {
            pixels = [...pixels, task];
            found_a_match = true;
          } else {
            for (let pixel of pixels) {
              if (
                (task.x - pixel.x) ** 2 + (task.y - pixel.y) ** 2 <=
                pixelRadius ** 2
              ) {
                pixels.push(task);
                found_a_match = true;
                break;
              }
            }
          }
          if (!found_a_match) {
            newTasks.push(task);
            stucknum++;
          } else {
            stucknum = 0;
          }
        }
        return pixels;
      };
    },
    "circledotting",
  ]);
  Mxobot.extensions.push([
    function () {
      function coordinate(x, y, ox, oy) {
        return [Math.abs(x - ox), Math.abs(y - oy)];
      }
      Mxobot.Tasker.onImageTaskReorganize = function (
        tasks,
        width,
        height,
        cx,
        cy
      ) {
        var [originX, originY] = [
          Math.floor(width / 2) + cx,
          Math.floor(height / 2) + cy,
        ];
        tasks.sort(
          (pixel1, pixel2) =>
            Math.hypot(pixel1.x - originX, pixel1.y - originY) -
            Math.hypot(pixel2.x - originX, pixel2.y - originY)
        );
        return tasks;
      };
    },
    "circlefilling",
  ]);

  Mxobot.extensions.push([
    function () {
      var colors = Array.from(
        document.querySelector("#palette-buttons").children
      )
        .filter((x) => x.className != "disabled")
        .map((x) => parseInt(x.getAttribute("data-id")));
      function ontask(task) {
        return task;
      }
      Mxobot.Tasker.onTaskAction = function (task) {
        if (task == undefined) return;
        task.color = colors[Math.floor(Math.random() * colors.length)];
        return true;
      };
      Mxobot.Tasker.onImageTaskReorganize = function (tasks) {
        if (!tasks || tasks.length == 0) {
          return [];
        }
        return tasks.map(function (task) {
          if (task == undefined) return;
          task.color = colors[Math.floor(Math.random() * colors.length)];
          return task;
        });
      };
    },
    "war",
  ]);
  Mxobot.extensions.push([
    function () {
      var colors = Array.from(
        document.querySelector("#palette-buttons").children
      )
        .filter((x) => x.className != "disabled")
        .map((x) => parseInt(x.getAttribute("data-id")));
      function ontask(task) {
        return task;
      }
      Mxobot.Tasker.onTaskAction = function (task) {
        if (task == undefined) return;
        task.color = colors[Math.floor(Math.random() * colors.length)];
        return true;
      };
      Mxobot.Tasker.onImageTaskReorganize = function (tasks) {
        if (!tasks || tasks.length == 0) {
          return [];
        }
        return tasks.map(function (task) {
          if (task == undefined) return;
          task.color = colors[Math.floor(Math.random() * colors.length)];
          task.x = tasks[0].x;
          task.y = tasks[0].y;
          return task;
        });
      };
    },
    "war in one pixel",
  ]);

  Mxobot.extensions.push([
    function () {
        Mxobot.Tasker.onTaskAction = () => true;
        Mxobot.Tasker.onImageTaskReorganize = undefined;
    },
    "Normalize Mxobot.Tasker events",
  ]);
  var fill_callback;
  var fill_ran = false;
  Mxobot.extensions.push([
    function () {
      if (fill_ran == false) {
        fill_ran = true;
        interact("#canvas").on("click", function () {
          if (fill_callback != undefined) {
            fill_callback();
          }
        });
      }
      let start_coordinate, end_coordinate;
      if (fill_callback) {
        fill_callback = undefined;
        toastr.info("closed fill");
        return;
      }
      toastr.info("opened fill");
      fill_callback = function () {
        if (start_coordinate) {
          end_coordinate = Mxobot.getCoordinates();
          let color = Mxobot.getSelectedColor();
          if (!color && color != 0) {
            return -1;
          }
          for (let y = start_coordinate[1]; y <= end_coordinate[1]; y++) {
            for (let x = start_coordinate[0]; x <= end_coordinate[0]; x++) {
              var mvpModeX;
              if ((y - start_coordinate[1]) % 2 == 0) {
                mvpModeX = x;
              } else {
                mvpModeX = end_coordinate[0] - x + start_coordinate[0];
              }
              Mxobot.Tasker._tasks.push({
                // @TODO Mxobot.Tasker
                x: mvpModeX,
                y: y,
                color: color,
              });
            }
          }
          Mxobot.Tasker._tasks = Mxobot.prepareTasks(Mxobot.Tasker._tasks)
          if (Mxobot.Tasker.onImageTaskReorganize) {
            Mxobot.Tasker._tasks = Mxobot.Tasker.onImageTaskReorganize(
                Mxobot.Tasker._tasks,
              end_coordinate[0] - start_coordinate[0],
              end_coordinate[1] - start_coordinate[1],
              ...start_coordinate
            );
          }
          start_coordinate = undefined;
        } else {
          start_coordinate = Mxobot.getCoordinates();
        }
      };
    },
    "fill",
  ]);

  Mxobot.extensions.push([
    function () {
      var timeout = prompt(
        "Your timeout is " +
          localStorage.timeout +
          " at the moment. Set timeout to (ms):"
      );
      if (isNaN(parseInt(timeout))) {
        return;
      }
      localStorage.timeout = parseInt(timeout);
    },
    "Set timeout",
  ]);
  Mxobot.extensions.push([
    function () {
      var name = prompt("Go to user:");
      $($('.messages div a[class="user open-profile"]').get(0))
        .attr("data-profile", name)
        .attr("data-id", name)
        .click();
    },
    "Go to user profile",
  ]);
});