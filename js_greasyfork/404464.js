//slightly modified from
//https://stackoverflow.com/questions/15504921/asynchronous-loop-of-jquery-deferreds-promises?answertab=votes#tab-top

/*
TODO Description
 */

var time = Math.floor(Math.random() * 3000);

function doTask(taskNum, next) {
    log("doTask Enter");
    setTimeout(function () {
        log(taskNum);
        next();
    }, time)
}

function createTask(taskNum){
	log("createTask Enter");
    return function(next){
        doTask(taskNum, next);
    }
}

function queueTask(tasks) {
    log("queueTask Enter!");
	log(tasks);
    //tasks is an array of functions
    for (var i = 0; i < tasks.length; i++) {
		log("queueTask i " + i);
        $(document).queue('tasks', createTask(tasks[i]));
    }

    $(document).queue('tasks', function () {
        log("All tasks dequeued");
    });
	
	dequeueTask();
}

function dequeueTask() {
    log("dequeueTask Enter");
    $(document).dequeue('tasks');
}
