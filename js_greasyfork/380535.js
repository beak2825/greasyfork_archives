// ==UserScript==
// @name         Parallel
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Asynchronous array handle
// @author       You
// ==/UserScript==

class Parallel{
    constructor(count=3){
        this.count=3
    }

    partial(data,count){
        let r=[];
        let l=data.length;
        let dataPerThread=parseInt(l/count);
        if (dataPerThread==0){
            dataPerThread=1;
        }
        for (let i=0;i<l;i+=dataPerThread){
            let to=Math.min(i+dataPerThread,l);
            let d=data.slice(i,to);
            r.push(d);
        }
        return r;
    }

    async run(data,action,isReturn=false){
        let results=[];
        for (let x in data){
			let r=action(data[x]);
			if (r instanceof Promise){
				r=await r;
			}
            if (isReturn){
                results.push(r);
            }
        }
        if (isReturn){
            return results;
        }
    }

    async forEach(data,action){
        data=this.partial(data,this.count);
        let threads=[];
        for (let i in data){
            let d=data[i];
            threads.unshift(this.run(d,action));
        }
        for (let x in threads){
            await threads[x];
        }
    }

    async map(data,action){
        data=this.partial(data,this.count);
        let threads=[];
        for (let i in data){
            let d=data[i];
            threads.unshift(this.run(d,action,true));
        }
        let results=[];
        for (let x in threads){
            results=results.concat(await threads[x]);
        }
        return results;
    }
}