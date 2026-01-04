// ==UserScript==
// @name         LINQ
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Linq for javascript
// @author       You
// @grant        none
// ==/UserScript==

class Enumerable{
    constructor(iterable,isClosure=true){
        this.iterable=isClosure?iterable():iterable;
        this.extends=[];
    }

    *[Symbol.iterator](){
        let cache=[];
        for(let x of this.iterable){
            cache.push(x);
            yield x;
        }
        for(let x of this.extends){
            cache.push(x);
            yield x;
        }
        this.iterable=cache;
    }

    compare(a,b){
        a=a+"";
        b=b+"";
        let al=a.length;
        let bl=b.length;
        let n=al>bl?al:bl;
        for (let i=0;i<n;i++){
            if (i<al && i<bl){
                if (a.charCodeAt(i)>b.charCodeAt(i)){
                    return 1;
                }
                else if (a.charCodeAt(i)<b.charCodeAt(i)){
                    return -1;
                }
            }
        }
        if (al>bl){
            return 1;
        }
        else if (al<bl){
            return -1;
        }
        return 0;
    }

    orderBy(selector){
        let sorted=this.toArray().sort((a,b)=>this.compare(selector(a),selector(b)));
        return new Enumerable(sorted,false);
    }

    orderByDescending(selector){
        let sorted=this.toArray().sort((a,b)=>this.compare(selector(b),selector(a)));
        return new Enumerable(sorted,false);
    }

    where(predicate){
        let a=this;
        return new Enumerable(function*(){
            for (let x of a){
                if (predicate(a)){
                    yield x;
                }
            }
        });
    }

    count(predicate){
        predicate=predicate || function(){return true;};
        let count=0;
        for(let x of this){
            if (predicate(x)){
                count+=1;
            }
        }
        return count;
    }

    first(predicate){
        predicate=predicate || function(){return true;};
        for(let x of this){
            if (predicate(x)){
                return x;
            }
        }
        throw "Sequence least than 1";
    }

    firstOrDefault(predicate){
        try {
            return this.first(predicate);
        }
        catch(e){
            return null;
        }
    }

    elementAt(n){
        let id=0;
        for (let x of this){
            if (id==n){
                return x;
            }
            id++;
        }
        throw "Index of found";
    }

    select(selector){
        let a=this;
        return new Enumerable(function*(){
            for(let x of a){
                yield selector(x);
            }
        });
    }

    join(object,outerSelector,innerSelector,selector){
        let a=this;
        return new Enumerable(function*(){
            for(let x of a){
                for(let y of object){
                    if (outerSelector(x)==innerSelector(y)){
                        yield selector(x,y);
                    }
                }
            }
        });
    }

    groupBy(selector){
        let sorted=this.orderBy(selector);
        return new Enumerable(function(){
            let isSetInit=false;
            let key=null;
            let temp=null;
            let result=[];
            for(let x of sorted){
                if (!isSetInit){
                    key=selector(x);
                    temp=new Grouping(key,[x]);
                    isSetInit=true;
                }
                else{
                    if (selector(x)==key){
                        temp.append(x);
                    }
                    else{
                        key=selector(x);
                        result.push(temp);
                        temp=new Grouping(key,[x]);
                    }
                }
            }
            result.push(temp);
            return result;
        });
    }

    distinct(selector){
        return this.groupBy(selector).select(x=>x.first());
    }

    toEnumerable(){
        return new Enumerable(this,false);
    }

    toArray(){
        let result=[];
        for(let x of this){
            result.push(x);
        }
        return result;
    }

    each(action){
        for (let x of this){
            action(x);
        }
    }

    aggregate(func,initValue=null){
        let isSetInit=false;
        let accu=null;
        if (initValue!=null){
            accu=initValue;
            isSetInit=false;
        }
        for (let x of this){
            if (!isSetInit && accu==null){
                accu=x;
                continue;
            }
            accu=func(accu,x);
        }
        if (accu==null){
            throw "Sequence less than 1";
        }
        return accu;
    }

    sum(selector){
        selector=selector || function(x){return x;};
        return this.select(selector).aggregate(function(accu,next){return accu+next;},0);
    }

    max(selector){
        selector=selector || function(x){return x;};
        return this.select(selector).aggregate(function(accu,next){return accu>next?accu:next;});
    }

    min(selector){
        selector=selector || function(x){return x;};
        return this.select(selector).aggregate(function(accu,next){return accu<next?accu:next;});
    }

    unique(selector){
        return this.groupBy(selector).select(function(x){return x.first();});
    }

    selectMany(collectionSelect=null,resultSelect=null){
        collectionSelect=collectionSelect || function(x){return x};
        resultSelect=resultSelect || function(x,y){return y;};
        let a=this;
        return new Enumerable(function*(){
            for(let x of a.select(collectionSelect)){
                for(let y of x){
                    yield resultSelect(x,y);
                }
            }
        });
    }

    static from(iterable){
        return new Enumerable(iterable,false);
    }

    static range(from,to){
        return new Enumerable(function*(){
            for(let i=from;i<to;i++){
                yield i;
            }
        });
    }

    static repeat(object,count){
        return new Enumerable(function*(){
            for(let i=0;i<count;i++){
                yield object;
            }
        });
    }

    append(object){
        this.extends.push(object);
    }
}

class Grouping extends Enumerable {
    constructor(key, iterable) {
        super(iterable,false);
        this.key = key;
    }
}
