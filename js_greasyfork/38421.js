// ==UserScript==
// @name            WME Utils - NavigationPoint
// @namespace       WazeDev
// @version         2023.12.05.01
// @description     NavigationPoint class necessary for creating an entryExitPoint in code.  Instantiate the class and pass the OL.Geometry.Point in the constructor then add the NavigationPoint object to the entryExitPoints array.
// @author          JustinS83
// @license         GNU GPLv3
// ==/UserScript==

class NavigationPoint
    {
        constructor(point){
            this._point = structuredClone(point);
            this._entry = true;
            this._exit = true;
            this._isPrimary = true;
            this._name = "";
        }

        with(){
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            if(e.point == null)
                e.point = this.toJSON().point;
            return new this.constructor((this.toJSON().point, e.point));
        }

        getPoint(){
            return structuredClone(this._point);
        }

        getEntry(){
            return this._entry;
        }

        getExit(){
            return this._exit;
        }

        getName(){
            return this._name;
        }

        isPrimary(){
            return this._isPrimary;
        }

        toJSON(){
            return  {
                point: this._point,
                entry: this._entry,
                exit: this._exit,
                primary: this._isPrimary,
                name: this._name
            };
        }

        clone(){
            return this.with();
        }
    }
